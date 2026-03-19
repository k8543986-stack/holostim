// app.js — Holostim v3.0 (Исправленная версия)

const DEV_MODE = true;

/* =======================
   ГЛОБАЛЬНЫЙ ОБЪЕКТ ИГРОКА
======================= */

// Проверяем, существует ли уже player из state.js
if (typeof window.player === 'undefined') {
    window.player = {
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
}

// Создаем локальную ссылку для удобства
const player = window.player;

/* =======================
   ОБЪЯВЛЕНИЕ ФУНКЦИЙ
======================= */

let onboardingStep = 1;

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
    
    // Проверяем, что player существует
    if (!window.player) {
        console.error("❌ player не определён, создаём новый");
        window.player = {
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
    }
    
    // Сохраняем пол
    window.player.gender = gender;
    console.log("✅ Пол сохранён в player:", window.player.gender);
    
    // Сохраняем временные данные в localStorage
    try {
        localStorage.setItem('holostim_player_temp', JSON.stringify(window.player));
        console.log("✅ Временные данные сохранены в localStorage");
    } catch (e) {
        console.error("❌ Ошибка сохранения в localStorage:", e);
    }
    
    // Переходим к следующему шагу
    showStep(2);
}

function saveNickname() {
    console.log("🔥 saveNickname вызван");
    
    // Проверяем, что player существует
    if (!window.player) {
        console.error("❌ player не определён");
        window.player = {
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
    }
    
    const input = document.getElementById('nicknameInput');
    
    if (!input || !input.value.trim()) {
        if (window.player.nickname) {
            console.log("✅ Используем ник из Telegram:", window.player.nickname);
            showStep(3);
            return;
        } else {
            alert('Введите ник');
            return;
        }
    }

    window.player.nickname = input.value.trim();
    console.log("✅ Ник сохранён:", window.player.nickname);
    
    // Сохраняем временные данные
    localStorage.setItem('holostim_player_temp', JSON.stringify(window.player));
    
    showStep(3);
}

function finishRegistration() {
    console.log("🔥 finishRegistration вызван");
    
    // Проверяем, что player существует
    if (!window.player) {
        console.error("❌ player не определён");
        window.player = {
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
    }
    
    // Проверяем, выбран ли пол
    if (!window.player.gender) {
        alert('Сначала выберите пол персонажа');
        showStep(1);
        return;
    }
    
    // Генерируем уникальный ID
    if (window.player.telegram_id) {
        window.player.id = `tg_${window.player.telegram_id}`;
    } else {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        window.player.id = `pwa_${timestamp}_${random}`;
    }
    
    if (!window.player.nickname) {
        window.player.nickname = 'Стрелок';
    }
    
    window.player.created_at = Date.now();
    window.player.last_login = Date.now();
    window.player.level = 1;
    window.player.league = 'Новичок';
    window.player.xp = 0;
    window.player.consent = true;
    
    // Сохраняем в localStorage
    try {
        localStorage.setItem('holostim_player', JSON.stringify(window.player));
        localStorage.removeItem('holostim_player_temp'); // Очищаем временные данные
        console.log('✅ Аккаунт создан:', window.player);
    } catch (e) {
        console.error("❌ Ошибка сохранения в localStorage:", e);
        alert('Ошибка при создании аккаунта');
        return;
    }
    
    // Отправляем данные в Telegram если нужно
    if (window.Telegram?.WebApp) {
        try {
            window.Telegram.WebApp.sendData(JSON.stringify({
                action: 'register',
                player_id: window.player.id,
                nickname: window.player.nickname,
                gender: window.player.gender
            }));
        } catch (e) {
            console.error("❌ Ошибка отправки в Telegram:", e);
        }
    }
    
    // Переходим в аккаунт
    window.location.href = 'account.html';
}

function resetAccount() {
    console.log("🔥 resetAccount вызван");
    if (confirm('Сбросить аккаунт? Весь прогресс будет потерян.')) {
        // Очищаем все данные
        localStorage.removeItem('holostim_player');
        localStorage.removeItem('holostim_player_temp');
        localStorage.removeItem('player_rating_position');
        
        // Сбрасываем объект player
        window.player = {
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
        
        console.log("✅ Аккаунт сброшен");
        
        // Перезагружаем страницу
        window.location.href = 'index.html';
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
            window.player.telegram_id = user.id;
            window.player.nickname = user.first_name;
            
            if (user.username) {
                window.player.username = user.username;
            }
            
            // Обновляем поле ввода ника если оно есть
            const nicknameInput = document.getElementById('nicknameInput');
            if (nicknameInput) {
                nicknameInput.placeholder = `Ваш ник (из Telegram: ${user.first_name})`;
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
    
    // Проверяем временные данные
    try {
        const tempPlayer = localStorage.getItem('holostim_player_temp');
        if (tempPlayer) {
            const parsed = JSON.parse(tempPlayer);
            Object.assign(window.player, parsed);
            console.log("✅ Восстановлены временные данные:", parsed);
            
            // Если пол уже выбран, показываем соответствующий шаг
            if (window.player.gender) {
                if (window.player.nickname) {
                    showStep(3);
                } else {
                    showStep(2);
                }
                return;
            }
        }
    } catch (e) {
        console.error("❌ Ошибка загрузки временных данных:", e);
    }
    
    // Показываем первый шаг
    showStep(1);

    // Настраиваем чекбокс согласия
    const consentCheckbox = document.getElementById('consentCheckbox');
    const finishBtn = document.getElementById('finishBtn');

    if (consentCheckbox && finishBtn) {
        // Устанавливаем начальное состояние
        finishBtn.disabled = !consentCheckbox.checked;
        
        // Добавляем обработчик
        consentCheckbox.addEventListener('change', () => {
            finishBtn.disabled = !consentCheckbox.checked;
        });
    }
    
    // Добавляем обработчики для зон выбора пола на всякий случай
    const maleZone = document.querySelector('.wick-male');
    const femaleZone = document.querySelector('.wick-female');
    
    if (maleZone) {
        maleZone.addEventListener('click', (e) => {
            e.preventDefault();
            chooseGender('male');
        });
    }
    
    if (femaleZone) {
        femaleZone.addEventListener('click', (e) => {
            e.preventDefault();
            chooseGender('female');
        });
    }
}

function initDevTools() {
    if (!DEV_MODE) {
        // Скрываем DEV кнопку если режим отключён
        const devBtn = document.getElementById('dev-reset-btn');
        if (devBtn) {
            devBtn.style.display = 'none';
        }
        return;
    }
    
    console.log('🛠️ DEV режим включён');
    
    // Проверяем наличие DEV кнопки
    const devBtn = document.getElementById('dev-reset-btn');
    if (devBtn) {
        devBtn.style.display = 'block';
        console.log('✅ DEV кнопка найдена и активирована');
    } else {
        console.log('⚠️ DEV кнопка не найдена в DOM');
    }
}

/* =======================
   APP INIT
======================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log("📱 DOM загружен, начинаем инициализацию...");
    
    // Проверяем, есть ли сохранённый аккаунт
    const savedPlayer = localStorage.getItem('holostim_player');
    if (savedPlayer) {
        console.log("👤 Найден сохранённый игрок, редирект в account.html");
        window.location.href = 'account.html';
        return;
    }
    
    // Инициализируем всё
    initOnboarding();
    initDevTools();
    loadTelegramData();
    
    console.log('✅ Инициализация завершена');
});

/* =======================
   ГЛОБАЛЬНЫЙ ЭКСПОРТ
======================= */

// Экспортируем все функции в глобальную область
window.showStep = showStep;
window.chooseGender = chooseGender;
window.saveNickname = saveNickname;
window.finishRegistration = finishRegistration;
window.resetAccount = resetAccount;
window.loadTelegramData = loadTelegramData;
window.initOnboarding = initOnboarding;
window.initDevTools = initDevTools;

// Обновляем ссылку на player
window.player = window.player || player;

// Финальная проверка
console.log('✅ app.js загружен и инициализирован');
console.log('📋 Проверка глобальных функций:', {
    chooseGender: typeof window.chooseGender,
    saveNickname: typeof window.saveNickname,
    finishRegistration: typeof window.finishRegistration,
    resetAccount: typeof window.resetAccount,
    showStep: typeof window.showStep
});
console.log('👤 window.player:', window.player);