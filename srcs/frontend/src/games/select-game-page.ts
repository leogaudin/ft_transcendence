import { navigateTo } from "../index.js";

export function initSelectPageEvent() {
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
      if (modeType === 'normal') {
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
        if (currentGame === "pong")
          navigateTo("/pong", { gameMode: mode, isCustom: mode.includes('custom') });
        else if (currentGame === "4inrow")
          console.log("Aqui iria el cuatro en raya");
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
  }
}