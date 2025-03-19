import { asyncHandler } from "./utils.js";

export default function createWebSocketsRoutes(fastify){
	return [
		{
			url: "/chat",
			method: "GET",
			websocket: true,
			handler: asyncHandler(async (socket, req) =>{
				socket.on("message", message => {
					socket.send(message.toString());
				})
			})
		}
	]
}