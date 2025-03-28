import { loadInfo } from "./load-info.js";
import { navigateTo } from "../index.js";
import { Message } from "../types.js";
import { friendID } from "./load-info.js"
import { actual_chat_id } from "./load-info.js";
import { recentChats } from "./load-info.js";

let socket: WebSocket | null = null;

export function initMessagesEvents() {
	moveToHome();
	loadInfo();
  createSocketConnection();
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

function getClientID(): number {
  let chats = localStorage.getItem("id");
  if (!chats)
    return -1;
  return parseInt(chats);
}

function createSocketConnection() {
  if (socket &&socket.readyState !== WebSocket.CLOSED){
    socket.close();
  }
  try{
    socket = new WebSocket("ws://localhost:9000/chat")
    if (!socket)
      return ;
    socket.onopen = () => {
      let id = getClientID();
      console.log("WebSocket connection established, sending id:", id);
      if (id === -1){
        console.error("Invalid ID, cannot connect to back")
      }
      else{
        if (!socket)
          return ;
        socket.send(JSON.stringify({
          userId: id,
          action: "identify"
        }));
        console.log("ID succesfully sent");
      }
    };
    socket.onmessage = (event) => {
      try{
        const data = JSON.parse(event.data);
        if (data.type === "message" || data.sender_id) {
          console.log(data);
          displayMessage(data);
        }
      }
      catch(err) {
        console.error("Error on message", err);
      }
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socket.onclose = () => {
      console.log("WebSocket connection closed");
      socket = null;
    };
  }
  catch(err){
    console.error("Error creating WebSocket:", err);
  }
}

function displayMessage(data: Message){
    let messageContainer = document.getElementById("message-history");
    if (!messageContainer)
      return ;
    let el = document.createElement("div");
    console.log(data.body)
    const sent_at = data.sent_at.substring(11, 16);
    if (data.sender_id === getClientID()){
      console.log("Yo envio:", data);
      el.setAttribute("id", "message");
      el.innerHTML = `
        <div class="message self-message">
          <p>${data.body}</p>
          <p class="hour">${sent_at}</p>
        </div>`;
    }
    else if (data.receiver_id === getClientID() && actual_chat_id === data.chat_id){
      console.log("Yo recibo:", data);
      el.setAttribute("id", "friend-message");
      el.innerHTML = `
      <div class="message friend-message">
        <p>${data.body}</p>
        <p class="hour">${sent_at}</p>
      </div>`;
    }
    messageContainer.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth'});
    recentChats();
}

function setupMessageForm() {
  const messageForm = document.getElementById("message-box") as HTMLFormElement;
  if (!messageForm)
    return;
  messageForm.addEventListener("submit", function(event){
    event.preventDefault();
    const input = messageForm.querySelector("input") as HTMLInputElement;
    if (!input)
      return;
    const message = input.value.trim();
    if (message && socket){
      const date = new Date();
      date.setHours(date.getHours() + 1);
      let fullMessage: Message = {
        body: message,
	      receiver_id: friendID,
	      sender_id: getClientID(),
        sent_at: date.toISOString(),
      }
      socket.send(JSON.stringify(fullMessage));
      displayMessage(fullMessage);
    }
    input.value = "";
  });
}
