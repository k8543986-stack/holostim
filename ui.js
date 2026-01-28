// ui.js
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => {
    s.style.display = 'none';
  });

  const screen = document.getElementById(screenId);
  if (screen) {
    screen.style.display = 'flex';
  }
}
