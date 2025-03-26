import { sendRequest } from "../login-page/login-fetch.js";
import { LastMessage } from "../types.js"
import { Chat } from "../types.js"
import { Message } from "../types.js";

export function loadInfo() {
	recentChats();
}

async function recentChats() {
	let last_chat = 0;
	const recentChatsDiv = document.getElementById("conversation-list");

	if (recentChatsDiv) {
		const recentChats = await sendRequest('GET', 'chats/last');
		const recentChatsTyped = recentChats as LastMessage[];

		recentChatsTyped.forEach((chat) => {
			var subDiv = document.createElement('div');
			subDiv.innerHTML = `
			<div id="chat-${chat.chat_id} "class="flex items-center gap-2 recent-chat-card">
				<div id="chat-avatar">
					<img class="rounded-full" src="../../resources/img/cat.jpg" alt="Avatar">
				</div>
				<div class="chat-info">
					<h3>${chat.sender_username}</h3>
					<p>${chat?.body}</p>
				</div>
			</div>
			`;

			recentChatsDiv.appendChild(subDiv);
			subDiv.addEventListener("click", () => {
				if (last_chat !== chat.chat_id) {
					last_chat = chat.chat_id;
					chargeChat(chat.chat_id)
				}
			});
		})
	}
}

async function chargeChat(chat_id: number) {
	const chatDiv = document.getElementById("message-history");

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
				}
				else {
					div.setAttribute("id", "message");
					div.innerHTML = `<div class="message self-message">${message.body}</div>`;
				}
			}
			div.scrollIntoView({ behavior: 'smooth' });
			chatDiv.appendChild(div);
		});
	}
}