import { getChatBetweenUsers } from "./models/chatModel.js";
import { createMessage } from "./models/messageModel.js";
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
				let userId = null;
				socket.on("message", async message => {
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
						if (data.receiver_id && data.body){
							const id = parseInt(data.receiver_id);
							const chat_id = await getChatBetweenUsers(data.sender_id, data.receiver_id);
							createMessage({
								body: data.body,
								sender_id: data.sender_id,
								receiver_id: data.receiver_id,
								chat_id: chat_id,
							})
							if (sockets.has(id)){
								const receiver = sockets.get(id);
								console.log(data);
								receiver.send(JSON.stringify({
									body: data.body,
									chat_id: chat_id,
									receiver_id: id,
									sender_id: userId,
									sent_at: data.sent_at,
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
