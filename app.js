// app.js

const DEV_MODE = true;

/* =======================
   APP INIT
======================= */

document.addEventListener('DOMContentLoaded', () => {
  initOnboarding();
  initDevTools();
});

let onboardingStep = 1;

/* =======================
   ONBOARDING
======================= */

function initOnboarding() {
  showStep(1);

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

/* =======================
   GENDER
======================= */

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

  // ПЕРЕХОД В АККАУНТ
  window.location.href = 'account.html';
}

/* =======================
   DEV
======================= */

function resetAccount() {
  localStorage.removeItem('holostim_player');
  location.reload();
}

function initDevTools() {
  if (!DEV_MODE) return;
  const devBtn = document.getElementById('dev-reset-btn');
  if (devBtn) devBtn.style.display = 'block';
}

/* =======================
   EXPORT
======================= */

window.chooseGender = chooseGender;
window.saveNickname = saveNickname;
window.finishRegistration = finishRegistration;
window.resetAccount = resetAccount;
window.showStep = showStep;
