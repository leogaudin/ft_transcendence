import { getUser, getUsers } from "./models/userModel.js";
import { asyncHandler, asyncWebSocketHandler } from "./utils.js";

const sockets = new Map();

export default function createWebSocketsRoutes(fastify){
	return [
		{
			url: "/chat",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket, req) =>{
				console.log("Client connected");
				let userId = null;
				socket.on("message", message => {
					const messageString = message.toString();
					if (userId === null){
						try{
							userId = parseInt(messageString);
							if (isNaN(userId)) {
							  const data = JSON.parse(messageString);
							  userId = data.userId;
							}
							if (userId){
							  sockets.set(userId, socket);
							  socket.send(JSON.stringify({
								type: "connection",
								status: "success",
								message: "Connected"
							  }));
							}
						  }
						  catch (err){
							console.error("Error can't get ID:", err);
							socket.send(JSON.stringify({
							  type: "error",
							  message: "Invalid Id"
							}));
						  }
					}
					else{
						const data = JSON.parse(messageString);
						console.log(data);
						if (data.to && data.content){
							const id = parseInt(data.to);
							if (sockets.has(id)){
								const receiver = sockets.get(id);
								console.log(receiver)
								receiver.send(JSON.stringify({
									from: userId,
									content: data.content
								}))
							}
						}
					}
				})
				socket.on("close", () => {
					console.log("Client disconnected");
					sockets.delete(userId)
				})
			})
		}
	]
}