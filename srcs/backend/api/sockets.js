import { asyncHandler } from "./utils.js";

export default function createWebSocketsRoutes(fastify){
	return [
		{
			url: "/chat",
			method: "GET",
			websocket: true,
			handler: asyncHandler(async (socket, req) =>{
				console.log("cliente conectado");
				socket.on("message", message => {
					const messageString = message.toString();
					console.log(messageString);
				})
			})
		}
	]
}