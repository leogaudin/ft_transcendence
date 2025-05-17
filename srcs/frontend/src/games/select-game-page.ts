import { navigateTo } from "../index.js";
import { debounce } from "../friends/friends-fetch.js";
import { sendRequest } from "../login-page/login-fetch.js";
import { UserMatches } from "../types.js";
import { socketToast } from "../toast-alert/toast-alert.js";
import { getClientID } from "../messages/messages-page.js";
import { showAlert } from "../toast-alert/toast-alert.js";

export function initSelectPageEvent(){
  initGameSelection();
  initHomeButton();
}

function initHomeButton(){
  const homeButton = document.getElementById('home-button');
  if (homeButton){
    homeButton.addEventListener('click', () => {
      navigateTo('/home');
    });
  }
}

function showRemoteSearch(mode: string) {
  const searchContainer = document.getElementById('remote-search-container');
  if (searchContainer) {
    searchContainer.classList.remove('hidden');
    initRemotePlayerSearch(mode);
  }
}

async function initRemotePlayerSearch(mode: string) {
  const searchInput = document.getElementById('remote-player-search') as HTMLInputElement;
  const searchResults = document.getElementById('remote-search-results');

  if (searchInput && searchResults) {
    searchInput.oninput = debounce(async () => {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        try {
          const matches = await sendRequest('POST', '/users/search', { username: query }) as UserMatches[];
          displayRemoteSearchResults(matches, searchResults, mode);
        } catch (error) {
          console.error('Error searching players:', error);
          searchResults.innerHTML = '<p>Error searching players</p>';
        }
      } else {
        searchResults.innerHTML = '';
      }
    }, 300);
  }
}

function displayRemoteSearchResults(players: UserMatches[], container: HTMLElement, mode: string) {
  container.innerHTML = '';
  
  if (!Array.isArray(players)) {
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
    option.innerHTML = `
      ${player.username}
      <button class="invite-button" data-user-id="${player.user_id}">
        Invite to Game
      </button>
    `;

    const inviteButton = option.querySelector('.invite-button');
    if (inviteButton) {
      inviteButton.addEventListener('click', () => {
        sendGameInvitation(player.user_id, player.username, mode);
      });
    }

    container.appendChild(option);
  });
}

function sendGameInvitation(receiverId: number, username: string, currentGame: string) {
  if (socketToast && socketToast.readyState === WebSocket.OPEN) {
    socketToast.send(JSON.stringify({
      type: 'game_invitation',
      info: 'request',
      sender_id: getClientID(),
      receiver_id: receiverId,
      game_type: currentGame,
      sent_at: new Date().toISOString()
    }));
    
    showAlert(`Invitation sent to ${username}`, 'toast-success');
  }
}

function showGameOptions(){
  const modal = document.getElementById('game-options-modal');
  const gameModes = document.querySelector('.game-modes');
  
  if (modal && gameModes){
    modal.classList.remove('hidden');
    gameModes.classList.remove('hidden');
  }
}

function initGameSelection(){
  const buttons = document.querySelectorAll('.game-button');
  const modal = document.getElementById('game-options-modal');
  const closeModal = modal?.querySelector('.close-modal');
  let currentGame: string = '';

  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const route = target.getAttribute('data-route');
      if (route){
        currentGame = route.replace('/', '');
        if (currentGame === 'tournament')
          navigateTo('/tournament');
        else
          showGameOptions();
      }
    });
  });
  const modeButtons = document.querySelectorAll('.mode-button');
  const normalModes = document.querySelector('.normal-modes');
  const customModes = document.querySelector('.custom-modes');

  modeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const modeType = target.getAttribute('data-mode-type');

      // Update active button
      modeButtons.forEach(btn => btn.classList.remove('active'));
      target.classList.add('active');

      // Show/hide appropriate options
      if (modeType === 'normal'){
        normalModes?.classList.remove('hidden');
        customModes?.classList.add('hidden');
      }
      else{
        normalModes?.classList.add('hidden');
        customModes?.classList.remove('hidden');
      }
    });
  });

  // Update option button handler to include custom modes
  
  const optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const mode = target.getAttribute('data-mode');
      if (mode && currentGame){
        if (mode === 'remote')
          showRemoteSearch(currentGame);
        else if (currentGame === "pong")
          navigateTo("/pong", { gameMode: mode, isCustom: mode.includes('custom') });
        else if (currentGame === "4inrow")
          navigateTo("/connectFour", { gameMode: mode, isCustom: mode.includes('custom') });
        if (mode !== 'remote')
          hideGameOptions();
      }
    });
  });
  if (closeModal){
    closeModal.addEventListener('click', hideGameOptions);
    if (modal){
      modal.addEventListener('click', (e) => {
        if (e.target === modal)
          hideGameOptions();
      });
    }
  }
  function hideGameOptions(){
    if (modal)
      modal.classList.add('hidden');
    if (customModes)
      customModes.classList.add("hidden");
    const modeButtons = document.querySelectorAll('.mode-button');
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-mode-type') === 'normal')
            btn.classList.add('active');
    });
  }
}
