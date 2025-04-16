import { getClientID } from "../messages/messages-page.js"
import { displayFriends, displayInvitations } from "../friends/friends-fetch.js";

let toastTimeout: number;
let socketToast: WebSocket | null;

const toastFeatures = [
	{type: "toast-error", icon: "error-icon"},
	{type: "toast-success", icon: "check-icon"},
];

function createsocketToastConnection() {
	if (socketToast && socketToast.readyState !== WebSocket.CLOSED)
	  socketToast.close();
	const userId = localStorage.getItem("id");
    if (!userId) {
      console.error("Can't connect to WebSocketToast");
      return;
    }
	try{
	  socketToast = new WebSocket(`wss://${window.location.hostname}:8443/ws/toast`)
	  if (!socketToast)
		return ;
	  socketToast.onopen = () => {
		let id = getClientID();
		console.log("WebsocketToast connection established, sending id:", id);
		if (id === -1)
		  console.error("Invalid ID, cannot connect to back");
		else{
		  if (!socketToast)
			return ;
		  socketToast.send(JSON.stringify({
			userId: id,
			action: "identify"
		  }));
		  console.log("ID succesfully sent");
		}
	  };
	  socketToast.onmessage = async (event) => {
		try{
			const data = JSON.parse(event.data);
			if (data.type === "friendRequest"){
				if (data.info === "request"){
					if (data.body){
						showAlert(data.body, "toast-success");
						const invitationListPage = document.getElementById("invitation-list");
						if (!invitationListPage)
							return ;
						if (invitationListPage.style.display === 'flex')
							displayInvitations();
					}
				}
				else if (data.info === "confirmation"){
					const invitationListPage = document.getElementById("invitation-list");
					const friendListPage = document.getElementById("friend-list");
					if (invitationListPage)
						if (invitationListPage.style.display === 'flex')
							displayInvitations();
					else if (friendListPage)
						displayFriends();
				}
				else if (data.info === "delete"){
					const friendListPage = document.getElementById("friend-list");
					if (!friendListPage)
						return ;
					displayFriends();
				}
			}
			else if (data.type === "chatToast")
				showAlert(data.body, "toast-success");
			else if (data.type === "tournament")
				showAlert(data.body, "toast-error");
		}
		catch(err) {
		  console.error("Error on message", err);
		}
	  };
	  socketToast.onerror = (error) => {
		console.error("WebsocketToast error:", error);
	  };
	  socketToast.onclose = () => {
		console.log("WebsocketToast connection closed");
		socketToast = null;
	  };
	}
	catch(err){
	  console.error("Error creating WebsocketToast:", err);
	}
}

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

export { createsocketToastConnection, socketToast }