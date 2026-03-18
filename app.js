// app.js — Holostim v3.0 (Гарантированная видимость функций)

const DEV_MODE = true;

/* =======================
   ГЛОБАЛЬНЫЙ ОБЪЕКТ ИГРОКА
======================= */

let player = {
    id: null,
    nickname: null,
    gender: null,
    level: 1,
    league: 'Новичок',
    xp: 0,
    consent: false,
    telegram_id: null,
    created_at: null,
    last_login: null
};

// Сразу делаем player глобальным
window.player = player;

/* =======================
   ОБЪЯВЛЕНИЕ ФУНКЦИЙ ДО ИХ ИСПОЛЬЗОВАНИЯ
======================= */

// Функции объявляем через function, чтобы они были видны до инициализации
function showStep(step) {
    console.log('📌 showStep вызван с шагом:', step);
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

function chooseGender(gender) {
    console.log("🔥 chooseGender вызван с полом:", gender);
    if (player) {
        player.gender = gender;
        console.log("✅ Пол сохранён в player:", player.gender);
    } else {
        console.error("❌ player не определён");
    }
    showStep(2);
}

function saveNickname() {
    console.log("🔥 saveNickname вызван");
    const input = document.getElementById('nicknameInput');
    
    if (!input || !input.value.trim()) {
        if (player.nickname) {
            console.log("✅ Используем ник из Telegram:", player.nickname);
            showStep(3);
            return;
        } else {
            alert('Введите ник');
            return;
        }
    }

    player.nickname = input.value.trim();
    console.log("✅ Ник сохранён:", player.nickname);
    showStep(3);
}

function finishRegistration() {
    console.log("🔥 finishRegistration вызван");
    
    // Генерируем уникальный ID
    if (player.telegram_id) {
        player.id = `tg_${player.telegram_id}`;
    } else {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        player.id = `pwa_${timestamp}_${random}`;
    }
    
    if (!player.nickname) {
        player.nickname = 'Стрелок';
    }
    
    player.created_at = Date.now();
    player.last_login = Date.now();
    player.level = 1;
    player.league = 'Новичок';
    player.xp = 0;
    player.consent = true;
    
    localStorage.setItem('holostim_player', JSON.stringify(player));
    console.log('✅ Аккаунт создан:', player);
    
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify({
            action: 'register',
            player_id: player.id,
            nickname: player.nickname
        }));
    }
    
    window.location.href = 'account.html';
}

function resetAccount() {
    if (confirm('Сбросить аккаунт? Весь прогресс будет потерян.')) {
        localStorage.removeItem('holostim_player');
        location.reload();
    }
}

function loadTelegramData() {
    console.log("📡 Загрузка данных из Telegram...");
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        
        const user = tg.initDataUnsafe?.user;
        
        if (user) {
            console.log('✅ Авторизация через Telegram:', user);
            player.telegram_id = user.id;
            player.nickname = user.first_name;
            
            if (user.username) {
                player.username = user.username;
            }
        } else {
            console.log('ℹ️ Пользователь не авторизован в Telegram');
        }
    } else {
        console.log('ℹ️ Режим: PWA/браузер');
    }
}

function initOnboarding() {
    console.log("🚀 Инициализация онбординга");
    showStep(1);

    const consentCheckbox = document.getElementById('consentCheckbox');
    const finishBtn = document.getElementById('finishBtn');

    if (consentCheckbox && finishBtn) {
        consentCheckbox.addEventListener('change', () => {
            finishBtn.disabled = !consentCheckbox.checked;
        });
    }
}

function initDevTools() {
    if (!DEV_MODE) return;
    const devBtn = document.getElementById('dev-reset-btn');
    if (devBtn) {
        devBtn.style.display = 'block';
        console.log('🛠️ DEV режим включён');
    }
}

/* =======================
   APP INIT
======================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log("📱 DOM загружен, начинаем инициализацию...");
    
    const savedPlayer = localStorage.getItem('holostim_player');
    if (savedPlayer) {
        console.log("👤 Найден сохранённый игрок, редирект в account.html");
        window.location.href = 'account.html';
        return;
    }
    
    initOnboarding();
    initDevTools();
    loadTelegramData();
});

let onboardingStep = 1;

/* =======================
   ГЛОБАЛЬНЫЙ ЭКСПОРТ (ГАРАНТИРОВАННЫЙ)
======================= */

// Принудительно записываем все функции в window
window.chooseGender = chooseGender;
window.saveNickname = saveNickname;
window.finishRegistration = finishRegistration;
window.resetAccount = resetAccount;
window.showStep = showStep;
window.loadTelegramData = loadTelegramData;
window.initOnboarding = initOnboarding;
window.player = player;

// Дублируем самые важные функции для надёжности
window.chooseGender = window.chooseGender || chooseGender;
window.saveNickname = window.saveNickname || saveNickname;
window.finishRegistration = window.finishRegistration || finishRegistration;

console.log('✅ app.js загружен и инициализирован');
console.log('📋 Проверка глобальных функций:', {
    chooseGender: typeof window.chooseGender,
    saveNickname: typeof window.saveNickname,
    finishRegistration: typeof window.finishRegistration,
    showStep: typeof window.showStep
});
console.log('👤 window.player:', window.player);