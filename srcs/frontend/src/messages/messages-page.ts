import { Socket } from "socket.io";
import { loadInfo } from "./load-info.js";
import { navigateTo } from "../index.js";
import { Chat } from "../types.js"

export function initMessagesEvents() {
	moveToHome();
	loadInfo();
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