import { sendRequest } from "../login-page/login-fetch.js";
import { LastMessage } from "../types.js"
import { Message } from "../types.js";
let friendID: number;

export function loadInfo() {
	displayFirstChat();
	recentChats();
}

async function displayFirstChat() {
	// Opens the most recent chat when navigated to messages page
	const recentChats = await sendRequest('GET', 'chats/last');
	const recentChatsTyped = recentChats as LastMessage[];

	if (recentChatsTyped)
		chargeChat(recentChatsTyped[0].chat_id, recentChatsTyped[0].friend_username);
}

async function recentChats() {
	let last_chat = 0;
	const recentChatsDiv = document.getElementById("conversation-list");

	if (recentChatsDiv) {
		const recentChats = await sendRequest('GET', 'chats/last');
		const recentChatsTyped = recentChats as LastMessage[];

		recentChatsTyped.forEach((chat) => {
			var subDiv = document.createElement('div');
			console.log("friend username: ", chat.friend_username);

			let truncated = "";
			chat.body?.length > 15 ? truncated = chat.body.substring(0, 15) + "..." : truncated = chat.body;

			subDiv.innerHTML = `
			<div id="chat-${chat.chat_id} "class="flex items-center gap-2 recent-chat-card">
				<div id="chat-avatar">
					<img class="rounded-full" src="../../resources/img/cat.jpg" alt="Avatar">
				</div>
				<div class="chat-info">
					<h3>${chat.friend_username}</h3>
					<p class="opacity-50 text-sm">${truncated}</p>
				</div>
			</div>
			`;

			recentChatsDiv.appendChild(subDiv);
			subDiv.addEventListener("click", () => {
				if (last_chat !== chat.chat_id) {
					last_chat = chat.chat_id;
					chargeChat(chat.chat_id, chat.friend_username);
				}
			});
		})
	}
}


async function chargeChat(chat_id: number, friend_username: string) {
	const chatDiv = document.getElementById("message-history");
	let contactName = document.getElementById("chat-friend-username");
	if (contactName)
		contactName.innerText = friend_username

	if (chatDiv) {
		if (chatDiv.children.length > 0)
			chatDiv.innerHTML = '';
		const chatHistory = await sendRequest('GET', `chats/${chat_id}`);
		const chatHistoryTyped = chatHistory as Message[];
		chatHistoryTyped.forEach((message) => {
			let div = document.createElement("div");
			
			const username = localStorage.getItem("username");
			if (username) {
				if (message.sender_username !== username) {
					div.setAttribute("id", "friend-message");
					div.innerHTML = `<div class="message friend-message">${message.body}</div>`;
					friendID = message.sender_id;
				}
				else {
					div.setAttribute("id", "message");
					div.innerHTML = `<div class="message self-message">${message.body}</div>`;
					friendID = message.receiver_id;
				}
			}
			div.scrollIntoView({ behavior: 'smooth' });
			chatDiv.appendChild(div);
		});
	}
}

export {friendID};