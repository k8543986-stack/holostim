// app.js — Holostim v2.0 (Telegram Integration + Smart ID)

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
    telegram_id: null,      // ID из Telegram (если есть)
    created_at: null,       // Дата создания
    last_login: null        // Последний вход
};

/* =======================
   APP INIT
======================= */

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, есть ли уже сохранённый игрок
    const savedPlayer = localStorage.getItem('holostim_player');
    if (savedPlayer) {
        // Если игрок уже есть — сразу в аккаунт
        window.location.href = 'account.html';
        return;
    }
    
    // Иначе показываем онбординг
    initOnboarding();
    initDevTools();
    
    // Пытаемся получить данные из Telegram
    loadTelegramData();
});

let onboardingStep = 1;

/* =======================
   ЗАГРУЗКА ДАННЫХ ИЗ TELEGRAM
======================= */

function loadTelegramData() {
    // Проверяем, запущено ли приложение внутри Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Расширяем на весь экран
        tg.expand();
        
        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        
        if (user) {
            console.log('✅ Авторизация через Telegram:', user);
            
            // Сохраняем Telegram ID
            player.telegram_id = user.id;
            
            // Предзаполняем ник из Telegram (можно изменить потом)
            player.nickname = user.first_name;
            
            // Если есть username, можно использовать его
            if (user.username) {
                player.username = user.username;
            }
            
            // Показываем приветствие (опционально)
            console.log(`👋 Привет, ${user.first_name}!`);
            
            // Можно отправить данные обратно в Telegram
            tg.sendData(JSON.stringify({
                action: 'init',
                player_id: user.id,
                nickname: user.first_name
            }));
        } else {
            console.log('ℹ️ Приложение открыто вне Telegram или пользователь не авторизован');
        }
    } else {
        console.log('ℹ️ Режим: PWA/браузер (Telegram SDK не загружен)');
    }
}

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
    
    // Если поле пустое, но есть ник из Telegram — используем его
    if (!input || !input.value.trim()) {
        if (player.nickname) {
            // Уже есть ник из Telegram
            showStep(3);
            return;
        } else {
            alert('Введите ник');
            return;
        }
    }

    // Сохраняем введённый ник (перезаписывает Telegram ник)
    player.nickname = input.value.trim();
    showStep(3);
}

/* =======================
   ГЕНЕРАЦИЯ УНИКАЛЬНОГО ID
======================= */

function generatePlayerId() {
    // Если есть Telegram ID — используем его как основной
    if (player.telegram_id) {
        return `tg_${player.telegram_id}`;
    }
    
    // Если нет Telegram ID — генерируем свой
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `pwa_${timestamp}_${random}`;
}

/* =======================
   FINISH
======================= */

function finishRegistration() {
    // Генерируем уникальный ID
    player.id = generatePlayerId();
    
    // Если ник не задан, ставим значение по умолчанию
    if (!player.nickname) {
        player.nickname = 'Стрелок';
    }
    
    // Добавляем временные метки
    player.created_at = Date.now();
    player.last_login = Date.now();
    
    // Начальные значения
    player.level = 1;
    player.league = 'Новичок';
    player.xp = 0;
    player.consent = true;
    
    // Сохраняем в localStorage
    localStorage.setItem('holostim_player', JSON.stringify(player));
    
    console.log('✅ Аккаунт создан:', player);
    
    // Если есть Telegram — уведомляем
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify({
            action: 'register',
            player_id: player.id,
            nickname: player.nickname
        }));
    }
    
    // Переход в аккаунт
    window.location.href = 'account.html';
}

/* =======================
   DEV
======================= */

function resetAccount() {
    if (confirm('Сбросить аккаунт? Весь прогресс будет потерян.')) {
        localStorage.removeItem('holostim_player');
        location.reload();
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
   ЭКСПОРТ ФУНКЦИЙ
======================= */

window.chooseGender = chooseGender;
window.saveNickname = saveNickname;
window.finishRegistration = finishRegistration;
window.resetAccount = resetAccount;
window.showStep = showStep;
window.player = player; // для отладки (можно удалить в проде)