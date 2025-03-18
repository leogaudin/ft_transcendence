// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server ", event.data);
});



io.on("connection", function(socket){
	//Ejecuta el update para nuevo usuario en el canal
	socket.on("newuser", function(username: string){	
		socket.broadcast.emit("update", username + " join the conversation");
	});
	//Ejecuta el update para salida de usuario del canal
	socket.on("exituser", function(username: string){
		socket.broadcast.emit("update", username + " left the conversation");
	});
	//Ejecuta el envio de los mensajes
	socket.on("chat", function(message: string){
		socket.broadcast.emit("chat", message);
	});
});
