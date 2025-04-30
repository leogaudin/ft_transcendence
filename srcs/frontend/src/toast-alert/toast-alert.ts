import { getClientID } from "../messages/messages-page.js"
import { displayFriends, displayInvitations, showMatches, debounce } from "../friends/friends-fetch.js";
import { createSocketTournamentConnection, socketTournament } from "../tournament/tournament.js";

let toastTimeout: NodeJS.Timeout;
let socketToast: WebSocket | null;
let tournament_id: number | null;

const toastFeatures = [
	{type: "toast-error", icon: "error-icon"},
	{type: "toast-success", icon: "check-icon"},
];

const updateFriendsList = debounce(() => {
	const friendListPage = document.getElementById("friend-list");
	if (!friendListPage)
		return ;
	displayFriends();
	
}, 500);

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
					const dataMatches = document.getElementById("search-friend");
					if (!dataMatches)
						return ;
					const friendInput = document.getElementById("friend-input") as HTMLInputElement;
					showMatches(friendInput.value);
				}
				else if (data.info === "delete"){
					const friendListPage = document.getElementById("friend-list");
					if (!friendListPage)
						return ;
					const friendProfile = document.getElementById("friend-profile");
					if (friendProfile)
						friendProfile.style.display = 'none';
					displayFriends();
					const dataMatches = document.getElementById("search-friend");
					if (!dataMatches)
						return ;
					const friendInput = document.getElementById("friend-input") as HTMLInputElement;
					showMatches(friendInput.value);
				}
			}
			else if (data.type === "chatToast")
				showAlert(data.body, "toast-success");
			else if (data.type === "friendStatusUpdate")
				updateFriendsList();
			//Implementacion basica de invitacion y torneo por comando
			else if (data.type === "tournament"){
				const tournament = data.tournament;
				if (data.info === "request"){
					tournament_id = tournament.id;
					console.log("soy el alertador", tournament)
						/*if (socketToast) {
							socketToast.send(JSON.stringify({
								type: "tournament",
								info: "accept",
								sender_id: getClientID(),
								receiver_id: data.sender_id,
								tournament_id: data.tournament_id
							}));
						}
						if (socketToast) {
							console.log("reject")
							socketToast.send(JSON.stringify({
								type: "tournament",
								info: "reject",
								sender_id: getClientID(),
								receiver_id: data.receiver_id_id,
								tournament_id: data.tournament_id
							}));
						}*/
						showAlert(data.body, "toast-success");
					}
				else if (data.info === "accept"){
					if (data.tournament){
						if (socketTournament){
							socketTournament.send(JSON.stringify({
								senderId: getClientID(),
								receiverId: data.sender_id,
								tournament_id: tournament_id,
								info: "accept",
							}))
						}
						showAlert(data.body, "toast-success");
					}
				}
				else if (data.info === "reject"){
					if (socketTournament){
						socketTournament.send(JSON.stringify({
							senderId: getClientID(),
							receiverId: data.sender_id,
							tournament_id: data.tournament_id,
							info: "reject",
						}))
					}
					showAlert(data.body, "toast-error");
				}
				else if (data.info === "creator")
					showAlert(data.body, "toast-success")
			}
		}
		catch(err){
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

export function showAlert(
  msg: string, 
  toastType: string, 
  acceptCallback?: () => void, 
  rejectCallback?: () => void
) {
  const toastText = document.getElementById("toast-message");
  const toastAlert = document.getElementById("toast-default");
  const acceptButton = document.getElementById("accept-button");
  const rejectButton = document.getElementById("reject-button");
  
  if (!toastText || !toastAlert) return;

  defineToastFeatures(toastType);
  toastText.innerText = msg;

  // Show/hide action buttons based on callbacks
  if (acceptButton && rejectButton) {
    if (acceptCallback && rejectCallback) {
      acceptButton.style.display = "block";
      rejectButton.style.display = "block";
      
      // Add event listeners
      acceptButton.onclick = function() {
        acceptCallback();
        toastAlert.style.display = "none";
      };
      
      rejectButton.onclick = function() {
        rejectCallback();
        toastAlert.style.display = "none";
      };
    } else {
      acceptButton.style.display = "none";
      rejectButton.style.display = "none";
    }
  }

  toastAlert.style.display = "flex";

  if (toastTimeout)
		clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toastAlert.style.display = "none"; }, 5000);
}

export { createsocketToastConnection, socketToast }