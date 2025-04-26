import { getChatInfo ,actual_chat_id, recentChats, loadInfo } from "./load-info.js"
import { navigateTo } from "../index.js";
import { Message, MessageObject } from "../types.js";
import { sendRequest } from "../login-page/login-fetch.js";
import { showAlert } from "../toast-alert/toast-alert.js";

let socketChat: WebSocket | null = null;

export function initMessagesEvents(data: MessageObject) {
	moveToHome();
	loadInfo(data);
  createSocketConnection();
  setupMessageForm();
}

export function moveToHome() {
	const homeButton = document.getElementById("home-button");
	if (!homeButton)
		return;
	homeButton.addEventListener("click", () => {
    if (socketChat)
      socketChat.close()
		navigateTo("/home");
	});
}

export function getClientID(): number {
  let chats = localStorage.getItem("id");
  if (!chats)
    return -1;
  return parseInt(chats);
}

function createSocketConnection() {
  if (socketChat && socketChat.readyState !== WebSocket.CLOSED)
    socketChat.close();
  try{
    socketChat = new WebSocket(`wss://${window.location.hostname}:8443/ws/chat`)
    if (!socketChat)
      return ;
    socketChat.onopen = () => {
      let id = getClientID();
      console.log("WebSocketChat connection established, sending id:", id);
      if (id === -1){
        console.error("Invalid ID, cannot connect to back")
      }
      else{
        if (!socketChat)
          return ;
        socketChat.send(JSON.stringify({
          userId: id,
          action: "identify"
        }));
        console.log("ID succesfully sent");
      }
    };
    socketChat.onmessage = (event) => {
      try{
        const data = JSON.parse(event.data);
        if (data.sender_id && data.body) {
          displayMessage(data);
        }
      }
      catch(err) {
        console.error("Error on message", err);
      }
    };
    socketChat.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    socketChat.onclose = () => {
      console.log("WebSocketChat connection closed");
      socketChat = null;
    };
  }
  catch(err){
    console.error("Error creating WebSocketChat:", err);
  }
}

function displayMessage(data: Message){
    if (actual_chat_id !== data.chat_id)
      showAlert(`You have a message from ${data.sender_username}`, "toast-success");
    let messageContainer = document.getElementById("message-history");
    if (!messageContainer)
      return ;
    let el = document.createElement("div");
    const sent_at = data.sent_at.substring(11, 16);
    if (data.sender_id === getClientID()){
      el.setAttribute("id", "message");
      el.innerHTML = `
        <div class="message self-message">
          <p>${data.body}</p>
          <p class="hour">${sent_at}</p>
        </div>`;
    }
    else if (data.receiver_id === getClientID() && actual_chat_id === data.chat_id){
      el.setAttribute("id", "friend-message");
      el.innerHTML = `
      <div class="message friend-message">
        <p>${data.body}</p>
        <p class="hour">${sent_at}</p>
      </div>`;
      sendRequest(`PATCH`, `/messages/${data.message_id}`, {is_read: 1});
    }
    messageContainer.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth'});
    recentChats();
}

async function setupMessageForm() {
  const messageForm = document.getElementById("message-box") as HTMLFormElement;
  if (!messageForm)
    return;
  messageForm.addEventListener("submit", async function(event){
    event.preventDefault();
    const input = messageForm.querySelector("input") as HTMLInputElement;
    if (!input)
      return;
    const message = input.value.trim();
    const chatInfo = await getChatInfo(actual_chat_id);
    if (!chatInfo)
      return ;
    const friendID = chatInfo.friend_id;
    if (message && socketChat){
      const date = new Date();
      date.setHours(date.getHours() + 2);
      if (message === "/tournament"){
        let fullMessage: Message = {
          body: message,
          chat_id: actual_chat_id,
	        receiver_id: friendID,
	        sender_id: getClientID(),
          sent_at: date.toISOString(),
          read: false,
          type: "tournament",
          info: "request",
        }
        socketChat.send(JSON.stringify(fullMessage));
      }
      else if (message === "/accept"){
        let fullMessage: Message = {
          body: message,
          chat_id: actual_chat_id,
	        receiver_id: friendID,
	        sender_id: getClientID(),
          sent_at: date.toISOString(),
          read: false,
          type: "tournament",
          info: "accept",
        }
        socketChat.send(JSON.stringify(fullMessage));
      }
      else if (message === "/refuse"){
        let fullMessage: Message = {
          body: message,
          chat_id: actual_chat_id,
	        receiver_id: friendID,
	        sender_id: getClientID(),
          sent_at: date.toISOString(),
          read: false,
          type: "tournament",
          info: "refuse",
        }
        socketChat.send(JSON.stringify(fullMessage));
      }
      else{
          let fullMessage: Message = {
          body: message,
          chat_id: actual_chat_id,
          receiver_id: friendID,
          sender_id: getClientID(),
          sent_at: date.toISOString(),
          read: false,
          type: "message",
        }
        socketChat.send(JSON.stringify(fullMessage));
        displayMessage(fullMessage);
      }
    }
    input.value = "";
  });
}

export { socketChat };
