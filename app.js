// app.js — Holostim v3.0 (Максимально надёжная версия)

// Жёстко определяем все функции в глобальной области видимости ДО всего
(function() {
    console.log("🔥 app.js загружается...");
    
    // ======================= ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =======================
    window.DEV_MODE = true;
    
    // Создаём объект игрока, если его нет
    if (!window.player) {
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
    
    let onboardingStep = 1;
    
    // ======================= ОПРЕДЕЛЕНИЕ ФУНКЦИЙ =======================
    // ВСЕ функции определяем через window. чтобы они были гарантированно глобальными
    
    window.showStep = function(step) {
        console.log('📌 showStep вызван с шагом:', step);
        onboardingStep = step;
        
        const steps = document.querySelectorAll('.onboarding-step');
        steps.forEach(el => el.classList.remove('active'));
        
        const stepsMap = {
            1: 'step-gender',
            2: 'step-nickname',
            3: 'step-consent'
        };
        
        const current = document.getElementById(stepsMap[step]);
        if (current) current.classList.add('active');
        
        const dots = document.querySelectorAll('.step-dot');
        dots.forEach(dot => {
            dot.classList.toggle('active', Number(dot.dataset.step) === step);
        });
    };
    
    window.chooseGender = function(gender) {
        console.log("🔥 chooseGender вызван с полом:", gender);
        
        // Создаём player если его нет
        if (!window.player) {
            window.player = {
                id: null,
                nickname: null,
                gender: null,
                level: 1,
                league: 'Новичок',
                xp: 0,
                consent: false
            };
        }
        
        window.player.gender = gender;
        console.log("✅ Пол сохранён:", window.player.gender);
        
        // Сохраняем в localStorage
        try {
            localStorage.setItem('holostim_player_temp', JSON.stringify(window.player));
        } catch (e) {
            console.error("Ошибка сохранения:", e);
        }
        
        // Переходим к следующему шагу
        if (window.showStep) {
            window.showStep(2);
        } else {
            console.error("showStep не определена!");
            // Прямой переход как запасной вариант
            document.getElementById('step-gender')?.classList.remove('active');
            document.getElementById('step-nickname')?.classList.add('active');
        }
        
        return false; // Предотвращаем любые действия по умолчанию
    };
    
    window.saveNickname = function() {
        console.log("🔥 saveNickname вызван");
        
        const input = document.getElementById('nicknameInput');
        
        if (!input || !input.value.trim()) {
            if (window.player && window.player.nickname) {
                console.log("Используем ник из Telegram");
                window.showStep(3);
                return;
            } else {
                alert('Введите ник');
                return;
            }
        }
        
        if (!window.player) window.player = {};
        window.player.nickname = input.value.trim();
        console.log("✅ Ник сохранён:", window.player.nickname);
        
        localStorage.setItem('holostim_player_temp', JSON.stringify(window.player));
        window.showStep(3);
    };
    
    window.finishRegistration = function() {
        console.log("🔥 finishRegistration вызван");
        
        if (!window.player) {
            window.player = {};
        }
        
        // Проверяем выбран ли пол
        if (!window.player.gender) {
            alert('Сначала выберите пол персонажа');
            window.showStep(1);
            return;
        }
        
        // Генерируем ID
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        window.player.id = `player_${timestamp}_${random}`;
        
        if (!window.player.nickname) {
            window.player.nickname = 'Стрелок';
        }
        
        window.player.created_at = Date.now();
        window.player.last_login = Date.now();
        window.player.level = 1;
        window.player.league = 'Новичок';
        window.player.xp = 0;
        window.player.consent = true;
        
        // Сохраняем
        localStorage.setItem('holostim_player', JSON.stringify(window.player));
        localStorage.removeItem('holostim_player_temp');
        
        console.log('✅ Аккаунт создан:', window.player);
        
        // Переходим в аккаунт
        window.location.href = 'account.html';
    };
    
    window.resetAccount = function() {
        console.log("🔥 resetAccount вызван");
        if (confirm('Сбросить аккаунт? Весь прогресс будет потерян.')) {
            localStorage.removeItem('holostim_player');
            localStorage.removeItem('holostim_player_temp');
            window.player = {
                id: null,
                nickname: null,
                gender: null,
                level: 1,
                league: 'Новичок',
                xp: 0,
                consent: false
            };
            window.location.href = 'index.html';
        }
    };
    
    window.loadTelegramData = function() {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.expand();
            
            const user = tg.initDataUnsafe?.user;
            if (user) {
                if (!window.player) window.player = {};
                window.player.telegram_id = user.id;
                window.player.nickname = user.first_name;
                console.log("Telegram данные загружены");
            }
        }
    };
    
    window.initOnboarding = function() {
        console.log("Инициализация онбординга");
        
        // Восстанавливаем временные данные
        try {
            const temp = localStorage.getItem('holostim_player_temp');
            if (temp) {
                window.player = JSON.parse(temp);
            }
        } catch (e) {}
        
        window.showStep(1);
        
        // Настраиваем чекбокс
        const consentCheckbox = document.getElementById('consentCheckbox');
        const finishBtn = document.getElementById('finishBtn');
        
        if (consentCheckbox && finishBtn) {
            finishBtn.disabled = !consentCheckbox.checked;
            consentCheckbox.onchange = function() {
                finishBtn.disabled = !this.checked;
            };
        }
    };
    
    // ======================= ИНИЦИАЛИЗАЦИЯ =======================
    // Запускаем когда DOM готов
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log("DOM готов, инициализация...");
            
            // Проверяем есть ли сохранённый аккаунт
            if (localStorage.getItem('holostim_player')) {
                window.location.href = 'account.html';
                return;
            }
            
            window.initOnboarding();
            window.loadTelegramData();
        });
    } else {
        // DOM уже готов
        if (localStorage.getItem('holostim_player')) {
            window.location.href = 'account.html';
            return;
        }
        
        window.initOnboarding();
        window.loadTelegramData();
    }
    
    console.log("✅ app.js полностью загружен");
    console.log("Доступные функции:", Object.keys(window).filter(k => 
        ['chooseGender', 'saveNickname', 'finishRegistration', 'resetAccount', 'showStep'].includes(k)
    ));
})();