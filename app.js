// app.js

/* =======================
   CONFIG
======================= */

const DEV_MODE = true; // ⬅️ В PROD поставить false

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

  // шаги
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

  // индикатор
  document.querySelectorAll('.step-dot').forEach(dot => {
    dot.classList.toggle('active', Number(dot.dataset.step) === step);
  });
}

function chooseGender(gender) {
  player.gender = gender;

  const screen = document.querySelector('.wick-gender-screen');

  // хаптик
  if (window.Telegram?.WebApp?.HapticFeedback) {
    Telegram.WebApp.HapticFeedback.impactOccurred('medium');
  }

  if (!screen) {
    showStep(2);
    return;
  }

  // анимация
  screen.classList.add('choice-made');
  screen.classList.add(gender === 'male' ? 'choice-male' : 'choice-female');

  setTimeout(() => {
    showStep(2);
    screen.classList.remove('choice-made', 'choice-male', 'choice-female');
  }, 450);
}

function saveNickname() {
  const input = document.getElementById('nicknameInput');
  if (!input || !input.value.trim()) {
    alert('Введите ник');
    return;
  }

  player.nickname = input.value.trim();
  showStep(3);
}

function finishRegistration() {
  player.id = Date.now(); // временный ID
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
  if (!bg || !player || !player.gender) return;

  if (player.gender === 'male') {
    bg.style.backgroundImage = "url('assets/img/wick_male.jpg')";
  } else if (player.gender === 'female') {
    bg.style.backgroundImage = "url('assets/img/wick_female.jpg')";
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
