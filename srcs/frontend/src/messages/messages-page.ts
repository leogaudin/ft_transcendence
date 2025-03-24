import { Socket } from "socket.io";
import { navigateTo } from "../index.js";
import { Chat } from "../types.js"

export function initMessagesEvents() {
	moveToHome();
	recentChats();
  initializeChat();
  setupMessageForm();
}

function moveToHome() {
	const homeButton = document.getElementById("home-button");
	if (!homeButton)
		return;

	homeButton.addEventListener("click", () => {
		navigateTo("/home");
	});
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
      var subDiv = document.createElement('div');
      subDiv.innerHTML = `
        <div class="flex items-center gap-2 recent-chat-card">
			<div id="chat-avatar">
				<img class="rounded-full" src="../../resources/img/cat.jpg" alt="Avatar">
			</div>
			<div class="chat-info">
				<h3>${typedChat.receiver}</h3>
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

function initializeChat() {

  socket.onopen = () => {
    console.log("WebSocket connection established");
  };
  socket.onmessage = () => {
    const messageForm = document.getElementById("message-box") as HTMLFormElement;
    if (!messageForm)
      return;
    let messageContainer = document.getElementById("message-history");
    if (!messageContainer)
      return ;
    const input = messageForm.querySelector("input") as HTMLInputElement;
    if (!input)
      return;
    const message = input.value.trim();
    let el = document.createElement("div");
    el.setAttribute("id", "message");

    let friendMessage = document.createElement("div");
    friendMessage.setAttribute("id", "friend-message");

    if (Math.floor(Math.random() * (2) + 1) == 1) {
      el.innerHTML = `
         <div class="message self-message">${message}</div>
      `;
      socket.send(message.toString())
      messageContainer.appendChild(el)
      el.scrollIntoView({ behavior: 'smooth' });
    }
    else {
      friendMessage.innerHTML = `
      <div class="message friend-message">${message}</div>
      `;
      socket.send(message.toString())
      messageContainer.appendChild(friendMessage);
      friendMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
  };
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
}

const socket = new WebSocket("ws://localhost:9000/chat");

function setupMessageForm() {
  let chats = localStorage.getItem("chats");
  if (!chats)
      return;
  const JSONchats = JSON.parse(chats);
  Object.entries(JSONchats).forEach(([index, chat]) => {
    const chatData = chat as Chat;
    console.log(chatData);
  })
  initializeChat();
  const messageForm = document.getElementById("message-box") as HTMLFormElement;
  if (!messageForm)
    return;
  messageForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const input = messageForm.querySelector("input") as HTMLInputElement;
      if (!input)
        return;
      const message = input.value.trim();
      if (message) {
        let messageContainer = document.getElementById("message-history")
      if (!messageContainer)
        return ;
      if (!socket)
        return ;
      socket.onmessage();
      input.value = "";
    }
  });
}