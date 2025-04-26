import { getClientID } from "../messages/messages-page.js";

export let socketTournament: WebSocket | null = null;

export function createSocketTournamentConnection(tournament_id: number){
	if (socketTournament && socketTournament.readyState !== WebSocket.CLOSED)
		socketTournament.close();
	  try{
		socketTournament = new WebSocket(`wss://${window.location.hostname}:8443/ws/tournament`)
		if (!socketTournament)
		  return ;
		socketTournament.onopen = () => {
			console.log(tournament_id)
		  console.log("WebSocketTournament connection established, sending id:", tournament_id);
		  if (tournament_id === -1){
			console.error("Invalid ID, cannot connect to back")
		  }
		  else{
			if (!socketTournament)
			  return ;
			socketTournament.send(JSON.stringify({
			  tournament_id: tournament_id,
			  action: "identify"
			}));
			console.log("ID succesfully sent");
		  }
		};
		socketTournament.onmessage = (event) => {
			  try{
				const data = JSON.parse(event.data);
				console.log(data);
			  }
			  catch(err) {
				console.error("Error on message", err);
			  }
			};
			socketTournament.onerror = (error) => {
			  console.error("WebSocketTournament error:", error);
			};
			socketTournament.onclose = () => {
			  console.log("WebSocketTournament connection closed");
			  socketTournament = null;
			};
	}
	catch(error){
		console.log("Error creating socketTournament: ", error);
	}
}