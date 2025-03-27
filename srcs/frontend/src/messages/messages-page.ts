import { loadInfo } from "./load-info.js";
import { navigateTo } from "../index.js";
import { Message } from "../types.js";
import { friendID } from "./load-info.js"

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
      console.log(id);
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
        if (data.type === "message" || data.from) {
          displayMessage({
            userId: data.from,
            content: data.content
          });
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

function displayMessage(data: any){
    let messageContainer = document.getElementById("message-history");
    if (!messageContainer)
      return ;
    let el = document.createElement("div");
    const whoSender = data.userId;
    console.log(whoSender);
    if (whoSender === getClientID()){
      el.setAttribute("id", "message");
      el.innerHTML = `
         <div class="message self-message">${data.content}</div>
      `;
    }
    else{
      el.setAttribute("id", "friend-message");
      el.innerHTML = `
         <div class="message friend-message">${data.content}</div>
      `;
    }
    messageContainer.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth'});
}

function setupMessageForm() {
  let friendName = document.getElementById("chat-friend-username") as HTMLTextAreaElement;
  if (friendName)
    console.log("friendName: ", friendName.innerText);
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
      socket.send(JSON.stringify({
        sender_id: getClientID(),
        receiver_id: friendID,
        content: message
      }));
      displayMessage({
        userId: getClientID(),
        content: message
      });
    }
    input.value = "";
  });
}
