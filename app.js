// app.js
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const saved = localStorage.getItem('holostim_player');

  if (saved) {
    player = JSON.parse(saved);
    appState = AppState.READY;
    showScreen('screen-main');
  } else {
    appState = AppState.NEW_USER;
    showScreen('screen-onboarding');
  }
}
