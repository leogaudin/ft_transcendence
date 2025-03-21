import { asyncHandler } from "./utils.js";

export default function createWebSocketsRoutes(fastify){
	return [
		{
			url: "/messages",
			method: "GET",
			websocket: true,
			handler: asyncHandler(async (socket, req) =>{
				socket.on("message", message => {
					console.log(message)
				})
			})
		}
	]
}