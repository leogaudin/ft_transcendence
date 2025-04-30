import { getChatBetweenUsers } from "./models/chatModel.js";
import { createMessage } from "./models/messageModel.js";
import { addParticipantToTournament, createTournament } from "./models/tournamentModel.js";
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
							const sender_id = parseInt(data.sender_id);
							const chat_id = await getChatBetweenUsers(data.sender_id, data.receiver_id);
							if (data.type !== "tournament"){
							 message = await createMessage({
									body: data.body,
									sender_id: data.sender_id,
									receiver_id: data.receiver_id,
									chat_id: chat_id,
									sent_at: data.sent_at
								})
							}
							if (socketsChat.has(id) && data.type !== "tournament"){
								const message_id = message.id;
								console.log(message_id);
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
								const toastSender = socketsToast.get(sender_id);
								//funcionamiento desde chat con comando /tournament, /accept, /refuse
								if (data.type === "tournament"){
									if (data.info === "request"){
										const tournament = await createTournament({
											name: "tournament",
											player_amount: 4,
											player_ids: [data.sender_id],
										});
										toastSender.send(JSON.stringify({
											type: "tournament",
											sender_id: data.sender_id,
											receiver_id: data.receiver_id,
											info: "creator",
											tournament_id: tournament.id,
										}))
										toastReceiver.send(JSON.stringify({
											type: "tournament",
											body: `You have a tournament request from ${username}`,
											sender_id: data.sender_id,
											receiver_id: data.receiver_id,
											info: "request",
											tournament_id: tournament.id,
										}))
									}
									else if (data.info === "accept"){
										const tournament_id = parseInt(data.tournament_id);
										const player_id = parseInt(data.sender_id);
										console.log(tournament_id);
										if (!socketsTournament.has(tournament_id)){
											console.error(`Tournament not found`);
											return ;
										}
										const tournament = await addPlayerToTournament(tournament_id, player_id);
										console.log(tournament)
										toastReceiver.send(JSON.stringify({
											type: "tournament",
											body: `Tournament request has been accepted from ${username}`,
											sender_id: data.sender_id,
											receiver_id: data.receiver_id,
											info: "accept",
											tournament_id: data.tournament_id,
										}))
									}
									else if (data.info === "refuse"){
										toastReceiver.send(JSON.stringify({
											type: "tournament",
											body: `Tournament request has been refused from ${username}`,
											sender_id: data.sender_id,
											receiver_id: data.receiver_id,
											info: "refuse",
											//tournament_id: ,
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
										info: "request",
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
						//Funcionamiento en toast para crear torneo
						else if (data.type === "tournament"){
							if (data.info === "request") {
								/*const tournament = await createTournament({
									name: "tournament",
									player_amount: 4,
									player_ids: [data.sender_id],
								});*/
								const receiver = socketsToast.get(receiver_id);
								const sender = socketsToast.get(sender_id);
								// Enviar notificación al creador
								sender.send(JSON.stringify({
									type: "tournament",
									sender_id: data.sender_id,
									receiver_id: data.receiver_id,
									info: "creator",
									tournament_id: data.tournament_id,
								}));
						
								// Enviar invitación al receptor
								console.log(data.tournament)
								receiver.send(JSON.stringify({
									type: "tournament",
									body: `You have a tournament request from ${username}`,
									sender_id: data.sender_id,
									receiver_id: data.receiver_id,
									info: "request",
									tournament: data.tournament,
								}));
							}
							else if (data.info === "accept"){
								const tournament_id = parseInt(data.tournament_id);
								console.log(tournament_id);
								const player_id = parseInt(data.sender_id);
								if (socketsTournament.has(tournament_id)){
									await addParticipantToTournament(tournament_id, player_id);
									console.log("añadi al torneo un usuario")
									receiver.send(JSON.stringify({
										type: "tournament",
										sender_id: data.sender_id,
										receiver_id: data.receiver_id,
										tournament_id: data.tournament_id,
										body: `Tournament request has been accepted from ${username}`,
										info: "accept",
									}))
								}
							}
							else if (data.info === "reject"){
								if (socketsTournament.has(data.tournament_id)){
									//Toda la informacion y configuracion necesaria a la hora de rechazar el torneo
									receiver.send(JSON.stringify({
										type: "tournament",
										sender_id: data.sender_id,
										receiver_id: data.receiver_id,
										tournament_id: data.tournament_id,
										body: `Tournament request has been refused from ${username}`,
										info: "reject",
									}))
								}
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
				let tournament_id = null;
				socket.on("message", async tournament => {
					const tournamentString = tournament.toString();
					console.log(tournamentString)
					if (tournament_id === null){
						try{
							const data = JSON.parse(tournamentString);
							const tournament = await createTournament({
								name: data.name,
								player_amount: 4,
								player_ids: [data.player_ids],
							});
							tournament_id = tournament.id;
							if (tournament_id){
							  socketsTournament.set(tournament_id, socket);
							  socket.send(JSON.stringify({
								type: "connection",
								status: "success",
								message: "Connected",
								tournament: tournament,
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
						const data = JSON.parse(tournament);
						//const sender_id = parseInt(data.sender_id);
						//const receiver_id = parseInt(data.receiver_id);
						//if (data.type === "refuse"){
						//	if (socketsToast.has(sender_id)){
						//		console.log("no quiero jugar")
						//	}
						//}
					}
				})
				socket.on("close", () => {
					console.log("Client disconnected from /tournament");
					socketsTournament.delete(tournament_id);
				})
			})
		}
	]
}
