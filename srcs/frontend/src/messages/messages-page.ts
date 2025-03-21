import { navigateTo } from "../index.js";
import { Chat } from "../types.js"

export function initMessagesEvents() {
	moveToHome();
	recentChats();
  writeMessage();
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

//Puede ser el fallo por la red de docker ¿host.docker.internal?
function initializeChat() {
  const socket = new WebSocket("ws://localhost:9000/messages");

  socket.onopen = () => {
    console.log("WebSocket connection established");
    // Any initialization logic
  };

  socket.onmessage = (event) => {
    console.log("Message received:", event.data);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  console.log(socket);
  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
}

function writeMessage() {
  let chats = localStorage.getItem("chats");
  if (!chats)
      return;

  const JSONchats = JSON.parse(chats);
  Object.entries(JSONchats).forEach(([index, chat]) => {
    const chatData = chat as Chat;
    console.log(chatData);
  })
}

function setupMessageForm() {
  const messageForm = document.getElementById("message-box") as HTMLFormElement;
  if (!messageForm) return;

  messageForm.addEventListener("submit", function(event) {
    // Evitar el comportamiento predeterminado (recargar la página)
    event.preventDefault();
    
    // Obtener el input dentro del formulario
    const input = messageForm.querySelector("input") as HTMLInputElement;
    if (!input) return;
    
    const message = input.value.trim();
    if (message) {
      // Enviar el mensaje mediante WebSocket
      const socket = initializeChat(); // Función para obtener tu socket activo
      
      // Limpiar el input después de enviar
      input.value = "";
    }
  });
}