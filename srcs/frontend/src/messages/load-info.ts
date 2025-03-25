import { Chat } from "../types.js"
import { Message } from "../types.js";

export function loadInfo() {
	recentChats();
}

function recentChats() {
	let chats = localStorage.getItem("chats");
	if (!chats)
	  return;
  
	const JSONchats = JSON.parse(chats);
	const recentChatsDiv = document.getElementById("conversation-list");
	if (recentChatsDiv) {
	  Object.entries(JSONchats).forEach(([index, chat]) => {
		const typedChat = chat as Chat;
		const lastMessage = (typedChat.messages as Message[]).pop();
		
		var subDiv = document.createElement('div');
		subDiv.innerHTML = `
		  <div class="flex items-center gap-2 recent-chat-card">
			  <div id="chat-avatar">
				  <img class="rounded-full" src="../../resources/img/cat.jpg" alt="Avatar">
			  </div>
			  <div class="chat-info">
				  <h3>${typedChat.receiver}</h3>
				   <p>${lastMessage?.body}</p>
			  </div>
		  </div>
		`;
		
	  //   // Add click event to open this chat
	  //   subDiv.addEventListener('click', () => {
	  //     // Navigate to chat or load conversation
	  //     console.log(`Opening chat with ${typedChat.first_username}, chat ID: ${typedChat.chat_id}`);
	  //   });
		
		recentChatsDiv.appendChild(subDiv);
	  });
	}
  }