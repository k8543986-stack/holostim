// app.js

/* =======================
   CONFIG
======================= */

const DEV_MODE = true; // ⬅️ В PROD просто поставишь false

/* =======================
   APP INIT
======================= */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initOnboarding();
  initDevTools();
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
    showStep(1);
  }
}

/* =======================
   ONBOARDING
======================= */

let onboardingStep = 1;

function initOnboarding() {
  const consentCheckbox = document.getElementById('consentCheckbox');
  const finishBtn = document.getElementById('finishBtn');

  if (consentCheckbox && finishBtn) {
    consentCheckbox.addEventListener('change', () => {
      finishBtn.disabled = !consentCheckbox.checked;
    });
  }
}

function showStep(step) {
  document.querySelectorAll('.onboarding-step').forEach(el => {
    el.classList.remove('active');
  });

  const stepsMap = {
    1: 'step-gender',
    2: 'step-nickname',
    3: 'step-consent'
  };

  const current = document.getElementById(stepsMap[step]);
  if (current) current.classList.add('active');
}

function chooseGender(gender) {
  player.gender = gender;
  onboardingStep = 2;
  showStep(onboardingStep);
}

function saveNickname() {
  const input = document.getElementById('nicknameInput');
  if (!input || !input.value.trim()) {
    alert('Введите ник');
    return;
  }

  player.nickname = input.value.trim();
  onboardingStep = 3;
  showStep(onboardingStep);
}

function finishRegistration() {
  player.id = Date.now(); // временно
  player.level = 1;
  player.league = 'Новичок';
  player.xp = 0;
  player.consent = true;

  localStorage.setItem('holostim_player', JSON.stringify(player));

  appState = AppState.READY;
  showScreen('screen-main');
}

/* =======================
   DEV TOOLS
======================= */

function resetAccount() {
  localStorage.removeItem('holostim_player');
  location.reload();
}

function initDevTools() {
  if (!DEV_MODE) return;

  const devBtn = document.getElementById('dev-reset-btn');
  if (devBtn) {
    devBtn.style.display = 'block';
  }
}
