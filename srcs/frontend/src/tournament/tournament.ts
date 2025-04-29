import { getClientID } from "../messages/messages-page.js";
import { UserMatches, Tournament } from "../types.js";
import { sendRequest } from "../login-page/login-fetch.js";
import { socketToast } from "../toast-alert/toast-alert.js";

export let socketTournament: WebSocket | null = null;
export let tournament: Tournament | null = null;

export function initTournamentEvents(){
	createTournament();
	initSearchPlayers();
}

export function createSocketTournamentConnection(tournamentName: string){
	if (socketTournament && socketTournament.readyState !== WebSocket.CLOSED)
		socketTournament.close();
	  try{
		socketTournament = new WebSocket(`wss://${window.location.hostname}:8443/ws/tournament`)
		if (!socketTournament)
		  return ;
		socketTournament.onopen = () => {
		  console.log("WebSocketTournament connection established, sending name");
		  if (!tournamentName)
			console.error("Invalid name, cannot connect to back")
		  else{
        if (!socketTournament)
          return ;
        socketTournament.send(JSON.stringify({
          name: tournamentName,
          player_ids: getClientID(),
          action: "identify"
        }));
        console.log("ID succesfully sent");
		  }
		};
		socketTournament.onmessage = (event) => {
			  try{
				const data = JSON.parse(event.data);
				tournament = data.tournament;
				console.log(tournament);
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

function createTournament(){
	const container = document.querySelector(".tournament-creation");
	if (container){
    const createInfo = container.querySelector("input[type='text']") as HTMLInputElement;
    const submitButton = container.querySelector("input[type='submit']") as HTMLInputElement;
    if (createInfo){
      createInfo.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleTournamentCreation(createInfo);
        }
      });
    }
		else{
      console.error("Input not found inside .tournament-creation");
    }
    if (submitButton) {
      submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (createInfo)
          handleTournamentCreation(createInfo);
      });
    }
		else{
      console.error("Submit button not found inside .tournament-creation");
    }

		initSearchPlayers();
  }
	else{
    console.error(".tournament-creation not found");
  }
}


function initSearchPlayers() {
  const searchInput = document.getElementById('player-search') as HTMLInputElement;
  const searchResults = document.getElementById('search-results');

  if (searchInput && searchResults) {
    let timeout: NodeJS.Timeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const query = searchInput.value.trim();
        if (query.length >= 2){
          try{
            const matches = await sendRequest('POST', '/users/search', { username: query }) as UserMatches[];
            displaySearchResults(matches, searchResults);
          } 
          catch (error){
            console.error('Error searching players:', error);
            searchResults.innerHTML = '<p>Error searching players</p>';
          }
        }
        else{
          searchResults.innerHTML = '';
        }
      }, 300);
    });
  }
}

function displaySearchResults(players: UserMatches[], container: HTMLElement) {
  container.innerHTML = '';
  if (!Array.isArray(players)) {
    console.error('Expected players to be an array, got:', typeof players);
    container.innerHTML = '<p>Error: Invalid data format</p>';
    return;
  }
  if (players.length === 0) {
    container.innerHTML = '<p>No players found</p>';
    return;
  }

  players.forEach(player => {
    const option = document.createElement('div');
    option.className = 'player-item';

    // Check if player is already in tournament, is invited, or can be invited
    if (!player.is_invited) {
      option.innerHTML = `
        ${player.username}
        <svg id="invite-player-${player.user_id}" class="standard-icon rounded-full add" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Z"/>
        </svg>
      `;

      const inviteButton = option.querySelector(`#invite-player-${player.user_id}`);
      if (inviteButton) {
        inviteButton.addEventListener("click", () => {
          if (sendTournamentInvitation(player.user_id, player.username) === true)
          option.innerHTML = `
            ${player.username}
            <svg xmlns="http://www.w3.org/2000/svg" class="pending rounded-full" viewBox="0 -960 960 960">
              <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
          `;
        });
      }
    } else if (player.is_invited) {
      option.innerHTML = `
        ${player.username}
        <svg xmlns="http://www.w3.org/2000/svg" class="pending rounded-full" viewBox="0 -960 960 960">
          <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
        </svg>
      `;
    } else {
      option.innerHTML = `
        ${player.username}
        <svg xmlns="http://www.w3.org/2000/svg" class="joined rounded-full" viewBox="0 -960 960 960">
          <path d="M880-80 720-240H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v560Z"/>
        </svg>
      `;
    }
    container.appendChild(option);
  });
}

function sendTournamentInvitation(receiverId: number, username: string): boolean {
  if (socketToast && socketToast.readyState === WebSocket.OPEN){
    if (tournament){
			socketToast.send(JSON.stringify({
				type: "tournament",
				info: "request",
				sender_id: getClientID(),
				receiver_id: receiverId,
				body: `/tournament ${username}`,
				tournament: tournament,
				sent_at: new Date().toISOString(),
			}));
			return (true);
		}
  }
	else
    console.error("Toast socket is not connected");
	return (false);
}

function handleTournamentCreation(input: HTMLInputElement) {
  const tournamentName = input.value.trim();
  if (tournamentName){
    console.log(`Creating tournament with name: ${tournamentName}`);
		createSocketTournamentConnection(tournamentName);
    input.value = "";
  }
}
