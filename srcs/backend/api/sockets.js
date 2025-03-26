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
					console.log(messageString);
					if (userId === null){
						userId = parseInt(messageString);
						sockets.set(userId, socket);
						console.log(sockets)
					}
				})
			})
		}
	]
}