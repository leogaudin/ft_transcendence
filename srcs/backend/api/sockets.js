import { getChatBetweenUsers } from "./models/chatModel.js";
import { createMessage } from "./models/messageModel.js";
import { getUsername, isBlocked, patchUser } from "./models/userModel.js";
import { asyncWebSocketHandler } from "./utils.js";

const socketsChat = new Map();
const socketsToast = new Map();
const socketsPong = new Map();
const socketsFourInARow = new Map();
const socketsTournament = new Map();

export default function createWebSocketsRoutes(fastify){
	return [
		{
			url: "/chat",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket) => {
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
						let username = await getUsername(data.sender_id);
						if (data.receiver_id && data.body && await isBlocked(data.sender_id, data.receiver_id) === false){
							const id = parseInt(data.receiver_id);
							const chat_id = await getChatBetweenUsers(data.sender_id, data.receiver_id);
							if (data.type !== "tournament"){
								const message = await createMessage({
									body: data.body,
									sender_id: data.sender_id,
									receiver_id: data.receiver_id,
									chat_id: chat_id,
									sent_at: data.sent_at
								})
							}
							if (socketsChat.has(id) && data.type !== "tournament"){
								const message_id = message.id;
								const receiver = socketsChat.get(id);
								receiver.send(JSON.stringify({
									body: data.body,
									message_id: message_id,
									chat_id: chat_id,
									receiver_id: id,
									sender_id: userId,
									sender_username: username,
									sent_at: data.sent_at,
									read: false,
								}))
							}
							else if (socketsToast.has(id)){
								const toastReceiver = socketsToast.get(id);
								//funcionamiento desde chat con comando /tournament, /accept, /refuse
								if (data.type === "tournament"){
									if (data.info === "request"){
										toastReceiver.send(JSON.stringify({
											type: "tournament",
											body: `You have a tournament request from ${username}`,
											sender_id: data.sender_id,
											receiver_id: data.receiver_id,
											info: "request",
										}))
									}
									else if (data.info === "accept"){
										toastReceiver.send(JSON.stringify({
											type: "tournament",
											body: `Tournament request has been accepted from ${username}`,
											sender_id: data.sender_id,
											receiver_id: data.receiver_id,
											info: "accept",
										}))
									}
									else if (data.info === "refuse"){
										toastReceiver.send(JSON.stringify({
											type: "tournament",
											body: `Tournament request has been refused from ${username}`,
											sender_id: data.sender_id,
											receiver_id: data.receiver_id,
											info: "refuse",
										}))
									}
								}
								else{
									toastReceiver.send(JSON.stringify({
										type: "chatToast",
										body: `You have a message from ${username}`,
									}))
								}
								
							}
						}
					}
				})
				socket.on("close", () => {
					console.log("Client disconnected from /chat");
					socketsChat.delete(userId);
				})
			})
		},
		{
			url: "/toast",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket) => {
				let userId = null;
				socket.on("message", async notification => {
					const toast = notification.toString();
					if (userId === null){
						try{
							userId = parseInt(toast);
							if (isNaN(userId)) {
							  const data = JSON.parse(toast);
							  userId = data.userId;
							}
							if (userId){
							  socketsToast.set(userId, socket);
							  console.log(socketsToast);
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
						await patchUser(userId, {is_online: 1});
						socketsToast.forEach((clientSocket, clientId) => {
							try {
							  clientSocket.send(JSON.stringify({
								type: "friendStatusUpdate",
								userId: userId,
								status: "online",
								timestamp: new Date().toISOString()
							  }));
							} catch (error) {
							  console.error(`Error while notification ${clientId}:`, error);
							}
						});
					}
					else{
						const data = JSON.parse(notification);
						const sender_id = parseInt(data.sender_id);
						const receiver_id = parseInt(data.receiver_id);
						let username = await getUsername(data.sender_id);
						if (data.type === "friendRequest"){
							if (data.info === "request"){
								if (socketsToast.has(receiver_id)){
									const receiver = socketsToast.get(receiver_id);
									receiver.send(JSON.stringify({
										sender_id: data.sender_id,
										receiver_id: data.receiver_id,
										type: "friendRequest",
										body: `You have a friend request from ${username}`,
										info: "request"
									}))
								}
							}
							else if (data.info === "confirmation"){
								if (socketsToast.has(sender_id)){
									const sender = socketsToast.get(sender_id);
									sender.send(JSON.stringify({
										type: "friendRequest",
										info: "confirmation"
									}))
								}
							}
							else if (data.info === "delete"){
								if (socketsToast.has(sender_id)){
									const sender = socketsToast.get(sender_id);
									sender.send(JSON.stringify({
										type: "friendRequest",
										info: "delete",
									}))
								}
							}
						}
						//Funcionamiento en boton para crear torneo
						else if (data.type === "tournament"){
							if (data.info === "request"){
								receiver.send(JSON.stringify({
									type: "tournament",
									sender_id: data.sender_id,
									receiver_id: data.receiver_id,
									tournament_id: userId,
									body: `You have a tournament request from ${username}`,
								}))
							}
							else if (data.info === "accept"){
								if (socketsTournament.has(data.tournamentId)){
									//Toda la informacion y configuracion necesaria a la hora de aceptar el torneo
									receiver.send(JSON.stringify({
										type: "tournament",
										sender_id: data.sender_id,
										receiver_id: data.receiver_id,
										tournament_id: data.tournament_id,
										body: `Tournament request has been accepted from ${username}`,
									}))
								}
							}
							else if (data.info === "refuse"){
								//Toda la informacion y configuracion necesaria a la hora de rechazar el torneo
								receiver.send(JSON.stringify({
									type: "tournament",
									sender_id: data.sender_id,
									receiver_id: data.receiver_id,
									tournament_id: data.tournament_id,
									body: `Tournament request has been refused from ${username}`,
								}))
							}
						}
					}
				})
				socket.on("close", async () => {
					console.log("Client disconnected from /toast");
					await patchUser(userId, {is_online: 0});
					socketsToast.forEach((clientSocket, clientId) => {
						try {
						  clientSocket.send(JSON.stringify({
							type: "friendStatusUpdate",
							userId: userId,
							status: "offline",
							timestamp: new Date().toISOString()
						  }));
						}
						catch (error){
						  console.error(`Error while notification ${clientId}:`, error);
						}
					});
					socketsToast.delete(userId);
				})
			})
		},
		{
			url: "/pong",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket) => {
				let userId = null;
				socket.on("message", async pong => {
					const game = pong.toString();
					if (userId === null){
						try{
							userId = parseInt(game);
							if (isNaN(userId)) {
							  const data = JSON.parse(game);
							  userId = data.userId;
							}
							if (userId){
							  socketsPong.set(userId, socket);
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

					}
				})
				socket.on("close", () => {
					console.log("Client disconnected from /pong");
					socketsPong.delete(userId);
				})
			})
		},
		{
			url: "/fourInARow",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket) => {
				let userId = null;
				socket.on("message", async InARow => {
					const game = InARow.toString();
					if (userId === null){
						try{
							userId = parseInt(game);
							if (isNaN(userId)) {
							  const data = JSON.parse(game);
							  userId = data.userId;
							}
							if (userId){
							  socketsFourInARow.set(userId, socket);
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

					}
				})
				socket.on("close", () => {
					console.log("Client disconnected from /fourInARow");
					socketsFourInARow.delete(userId);
				})
			})
		},
		{
			// socketsTournament(tournamentId, socket)
			url: "/tournament",
			method: "GET",
			websocket: true,
			handler: asyncWebSocketHandler(async (socket) => {
				let userId = null;
				socket.on("message", async tournament => {
					const tournamentString = tournament.toString();
					if (userId === null){
						try{
							userId = parseInt(tournamentString);
							if (isNaN(userId)) {
							  const data = JSON.parse(tournamentString);
							  userId = data.userId;
							}
							if (userId){
							  socketsTournament.set(userId, socket);
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

					}
				})
				socket.on("close", () => {
					console.log("Client disconnected from /tournament");
					socketsTournament.delete(userId);
				})
			})
		}
	]
}
