// app.js

/* =======================
   CONFIG
======================= */

const DEV_MODE = true;

/* =======================
   GLOBAL STATE
======================= */

let player = {};
let appState = null;

const AppState = {
  NEW_USER: 'NEW_USER',
  READY: 'READY'
};

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
    try {
      player = JSON.parse(saved);
    } catch (e) {
      console.error('Ошибка чтения профиля', e);
      localStorage.removeItem('holostim_player');
      showScreen('screen-onboarding');
      showStep(1);
      return;
    }

    appState = AppState.READY;
    showScreen('screen-main');
    applyAccountBackground();
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
  onboardingStep = step;

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

  document.querySelectorAll('.step-dot').forEach(dot => {
    dot.classList.toggle('active', Number(dot.dataset.step) === step);
  });
}

/* ===== ВЫБОР ПОЛА (УПРОЩЁННЫЙ, ЖЕЛЕЗНЫЙ) ===== */

function chooseGender(gender) {
  console.log("Выбран пол:", gender);
  player.gender = gender;
  showStep(2);
}

/* =======================
   NICKNAME
======================= */

function saveNickname() {
  const input = document.getElementById('nicknameInput');
  if (!input || !input.value.trim()) {
    alert('Введите ник');
    return;
  }

  player.nickname = input.value.trim();
  showStep(3);
}

/* =======================
   FINISH
======================= */

function finishRegistration() {
  player.id = Date.now();
  player.level = 1;
  player.league = 'Новичок';
  player.xp = 0;
  player.consent = true;

  localStorage.setItem('holostim_player', JSON.stringify(player));

  appState = AppState.READY;
  showScreen('screen-main');
  applyAccountBackground();
}

/* =======================
   ACCOUNT BACKGROUND
======================= */

function applyAccountBackground() {
  const bg = document.getElementById('main-bg');
  console.log('BG ELEMENT:', bg);
  console.log('PLAYER:', player);

  if (!bg || !player || !player.gender) return;

  if (player.gender === 'male') {
    bg.style.backgroundImage = "url('./assets/img/wick_male.jpg')";
  } else {
    bg.style.backgroundImage = "url('./assets/img/wick_female.jpg')";
  }
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

/* =======================
   SCREEN SWITCHER
======================= */

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.style.display = 'none';
  });

  const screen = document.getElementById(id);
  if (screen) {
    screen.style.display = 'flex';
  }
}

/* =======================
   EXPORT TO HTML
======================= */

window.chooseGender = chooseGender;
window.saveNickname = saveNickname;
window.finishRegistration = finishRegistration;
window.resetAccount = resetAccount;
window.showStep = showStep;
