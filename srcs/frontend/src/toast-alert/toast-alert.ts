import { getClientID } from "../messages/messages-page.js"

let toastTimeout: number;
let socket: WebSocket | null;

const toastFeatures = [
	{type: "toast-error", icon: "error-icon"},
	{type: "toast-success", icon: "check-icon"},
];

/*function createSocketConnection() {
	if (socket &&socket.readyState !== WebSocket.CLOSED){
	  socket.close();
	}
	try{
	  socket = new WebSocket("ws://localhost:9000/toast")
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
		  if (data.type === "toast" && data.body) {
			console.log(data);
			displayToast(data.body);
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
*/
function defineToastFeatures(type: string) {
	const toast = document.getElementById("toast-default");
	const icon = document.getElementById("toast-icon");
	if (!toast || !icon)
		return ;

	for (let i = 0; i < toastFeatures.length; i++) {
		if (toast.classList.contains(toastFeatures[i].type))
			toast.classList.remove(toastFeatures[i].type);
		if (icon.classList.contains(toastFeatures[i].icon))
			icon.classList.remove(toastFeatures[i].icon);

		if (toastFeatures[i].type === type) {
			toast.classList.add(toastFeatures[i].type);
			icon.classList.add(toastFeatures[i].icon);
		}
	}
}

export function displayToast() {
	const toastAlert = document.getElementById("toast-default");
	if (!toastAlert)
		return ;

	toastAlert.addEventListener("click", (e: Event) => {
		const target = e.target as HTMLElement;
		if (target && target.classList.contains("close-icon")) {
			toastAlert.style.display = "none";
		}
	});
}

export function showAlert(msg: string, toastType: string) {
	const toastText = document.getElementById("toast-message");
	const toastAlert = document.getElementById("toast-default");
	if (!toastText || !toastAlert)
		return;

	defineToastFeatures(toastType);
	toastText.innerText = msg;
	toastAlert.style.display = "flex";

	if (toastTimeout) { clearTimeout(toastTimeout); }
	toastTimeout = setTimeout(() => { toastAlert.style.display = "none"; }, 5000);
}
