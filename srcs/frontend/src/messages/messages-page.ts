import { Socket } from "socket.io";
import { loadInfo } from "./load-info.js";
import { navigateTo } from "../index.js";
import { Chat } from "../types.js"

export function initMessagesEvents() {
	moveToHome();
	loadInfo();
  initializeChat();
  setupMessageForm();
  //getClientID();
}

const socket = new WebSocket("ws://localhost:9000/chat");

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
    let id = getClientID();
    console.log("WebSocket connection established, sending id:", id);
    socket.send(id.toString());
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

function getClientID(): number {
  let chats = localStorage.getItem("chats");
  if (!chats)
    return 0;
  const JSONchats = JSON.parse(chats);
  let id = JSONchats[1].first_user_id;
  return id;
}

function setupMessageForm() {
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