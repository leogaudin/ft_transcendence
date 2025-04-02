import { getChatBetweenUsers } from "./models/chatModel.js";
import { createMessage } from "./models/messageModel.js";
//import { getUser, getUsers } from "./models/userModel.js";
import { asyncWebSocketHandler } from "./utils.js";

const socketsChat = new Map();
const socketsToast = new Map();

export default function createWebSocketsRoutes(fastify){
	return [
		{
			url: "/chat",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket, req) => {
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
							  socketsChat.set(userId, socket);
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
						if (data.receiver_id && data.body){
							const id = parseInt(data.receiver_id);
							const chat_id = await getChatBetweenUsers(data.sender_id, data.receiver_id);
							createMessage({
								body: data.body,
								sender_id: data.sender_id,
								receiver_id: data.receiver_id,
								chat_id: chat_id,
								sent_at: data.sent_at
							})
							if (socketsChat.has(id)){
								const receiver = socketsChat.get(id);
								receiver.send(JSON.stringify({
									body: data.body,
									chat_id: chat_id,
									receiver_id: id,
									sender_id: userId,
									sent_at: data.sent_at,
								}))
								
							}
							else if (socketsToast.has(id)){
								const toastReceiver = socketsToast.get(id);
								console.log("Llego desde aqui");
								toastReceiver.send(JSON.stringify({
									body: "You have a message from ",
								}))
							}
						}
					}
				})
				socket.on("close", () => {
					console.log("Client disconnected");
					socketsChat.delete(userId);
				})
			})
		},
		{
			url: "/toast",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket, req) => {
				let userId = null;
				socket.on("message", async notification => {
					const toast = notification.toString();
					if (userId === null){
						try{
							console.log(toast)
							userId = parseInt(toast);
							if (isNaN(userId)) {
							  const data = JSON.parse(toast);
							  userId = data.userId;
							}
							if (userId){
							  socketsToast.set(userId, socket);
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
						const data = JSON.parse(notification);
						console.log(socketsToast);
						console.log("Soy toast")
						if (data.body){
							console.log(socketsToast)
							/*if (socketsToast.has(id)){
								const toastReceiver = socketsToast.get(id);
								toastReceiver.send(JSON.stringify({
									body: "You have a message",
								}))
							}*/
						}
					}
				})
				socket.on("close", () => {
					console.log("Client disconnected");
					socketsToast.delete(userId);
				})
			})
		}
	]
}
