import { sendRequest } from "../login-page/login-fetch.js";
import { LastMessage } from "../types.js"
import { Message } from "../types.js";
let friendID: number;
let actual_chat_id: number;

export function loadInfo() {
	displayFirstChat();
	recentChats();
	searchChatFriend();

	const returnButton = document.getElementById("go-back-chat");
	if (returnButton)
		returnButton.addEventListener("click", () => {
			toggleMobileDisplay();
	});
	window.addEventListener("resize", changedWindowSize);

	
}

function searchChatFriend() {
	const searchFriend = document.getElementById("search-friend-chat");
	if (searchFriend) {
		searchFriend.addEventListener("submit", (e) => {
			e.preventDefault();
			const input = searchFriend.querySelector("input") as HTMLInputElement;
			if (!input)
			return;

			// Here goes the functionality of searching a friend
			input.value = "";
		});
	}
}

function changedWindowSize() {
	const conversationList = document.getElementById("conversation-list");
	const conversationHistory = document.getElementById("conversation-history");
	const returnButton = document.getElementById("go-back-chat");
	if (conversationList && conversationHistory && returnButton) {
		if (window.innerWidth > 768) {
			conversationList.style.display = 'block';
			conversationHistory.style.display = 'flex';
			returnButton.style.display = 'none';
		}
		else {
			conversationList.style.display = 'block';
			conversationHistory.style.display = 'none';
			returnButton.style.display = 'none';
		  }
	}
}

function toggleMobileDisplay() {
	const conversationList = document.getElementById("conversation-list");
	const conversationHistory = document.getElementById("conversation-history");
	const returnButton = document.getElementById("go-back-chat");

	if (conversationList && conversationHistory && returnButton) {
		if (conversationList.style.display !== 'none') {
			conversationList.style.display = 'none';
			conversationHistory.style.display = 'flex';
			returnButton.style.display = 'flex';
		}
		else {
			returnButton.style.display = 'none';
			conversationHistory.style.display = 'none';
			conversationList.style.display = 'block';
			recentChats();
		}
	}
}

async function displayFirstChat() {
	if (window.innerWidth < 768)
		return ;

	// Opens the most recent chat when navigated to messages page
	const recentChats = await sendRequest('GET', 'chats/last');
	const recentChatsTyped = recentChats as LastMessage[];

	if (recentChatsTyped)
		chargeChat(recentChatsTyped[0].chat_id, recentChatsTyped[0].friend_username);
}


// Refrescar cuando se recibe un mensaje en segundo plano no funciona bien
export async function recentChats() {
	let last_chat = 0;
	const recentChatsDiv = document.getElementById("conversation-list");

	if (recentChatsDiv) {
		const searchForm = document.getElementById("search-friend-chat");
		const chatEntries = recentChatsDiv.querySelectorAll("div:not(#search-friend-chat)");
		chatEntries.forEach(entry => {
		  if (entry !== searchForm)
			entry.remove();
		});

		const recentChats = await sendRequest('GET', 'chats/last');
		const recentChatsTyped = recentChats as LastMessage[];

		recentChatsTyped.forEach((chat) => {
			var subDiv = document.createElement('div');

			let truncated = "";
			chat.body?.length > 15 ? truncated = chat.body.substring(0, 15) + "..." : truncated = chat.body;

			subDiv.innerHTML = `
			<div id="chat-${chat.chat_id} "class="flex items-center gap-2 recent-chat-card">
				<div id="chat-avatar">
					<img class="rounded-full" src="../../resources/img/cat.jpg" alt="Avatar">
				</div>
				<div class="chat-info overflow-hidden">
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
	if (window.innerWidth < 768)
		toggleMobileDisplay();

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
				const sent_at = message.sent_at.substring(11, 16);
				if (message.sender_username !== username) {
					div.setAttribute("id", "friend-message");
					div.innerHTML = `
					<div class="message friend-message">
						<p>${message.body}</p>
						<p class="hour">${sent_at}</p>
					</div>`;
					friendID = message.sender_id;
				}
				else {
					div.setAttribute("id", "message");
					div.innerHTML = `<div class="message self-message">
						<p>${message.body}<\p>
						<p class="hour">${sent_at}</p>
					</div>`;
					friendID = message.receiver_id;
				}
			}
			chatDiv.appendChild(div);
			div.scrollIntoView({ behavior: 'smooth' });
		});
		actual_chat_id = chat_id;
	}
}
export {actual_chat_id}; // Forma sucia para recibir el chat_id, en proceso de buscar una forma nueva de arreglarlo
export {friendID};