// account.js

// Массив званий (все 60 званий из твоего документа)
const RANKS = [
    {"id": 1, "title": "Начинающий стрелок", "league": "Твёрдая рука", "xp": 10},
    {"id": 2, "title": "Рекрут", "league": "Твёрдая рука", "xp": 30},
    {"id": 3, "title": "Рекрут 1 Класса", "league": "Твёрдая рука", "xp": 50},
    {"id": 4, "title": "Рекрут 2 Класса", "league": "Твёрдая рука", "xp": 70},
    {"id": 5, "title": "Стажёр Арены", "league": "Твёрдая рука", "xp": 100},
    {"id": 6, "title": "Первая кровь", "league": "Путь охотника", "xp": 150},
    {"id": 7, "title": "Стрелок Второго класса", "league": "Путь охотника", "xp": 200},
    {"id": 8, "title": "Стрелок первого класса", "league": "Путь охотника", "xp": 300},
    {"id": 9, "title": "Нацеленный", "league": "Путь охотника", "xp": 400},
    {"id": 10, "title": "Последняя кровь", "league": "Путь охотника", "xp": 500},
    {"id": 11, "title": "Молодой мастер", "league": "Путь мастера", "xp": 700},
    {"id": 12, "title": "Старший мастер", "league": "Путь мастера", "xp": 900},
    {"id": 13, "title": "Мастер сержант", "league": "Путь мастера", "xp": 1300},
    {"id": 14, "title": "Мастер Лейтенант", "league": "Путь мастера", "xp": 1600},
    {"id": 15, "title": "Майор мастер", "league": "Путь мастера", "xp": 2000},
    {"id": 16, "title": "Почётный стрелок", "league": "Признанные Мастера", "xp": 2500},
    {"id": 17, "title": "Вольный стрелок", "league": "Признанные Мастера", "xp": 3500},
    {"id": 18, "title": "Будущий наёмник", "league": "Признанные Мастера", "xp": 5000},
    {"id": 19, "title": "Контрактник", "league": "Признанные Мастера", "xp": 7000},
    {"id": 20, "title": "Старший мастер среднего уровня", "league": "Признанные Мастера", "xp": 10000},
    {"id": 21, "title": "Посвящённый Стрелок", "league": "Почётная гвардия", "xp": 15000},
    {"id": 22, "title": "Безупречный стрелок", "league": "Почётная гвардия", "xp": 20000},
    {"id": 23, "title": "Страж почётной гвардии", "league": "Почётная гвардия", "xp": 25000},
    {"id": 24, "title": "Офицер почётной гвардии", "league": "Почётная гвардия", "xp": 30000},
    {"id": 25, "title": "Капитан арены", "league": "Почётная гвардия", "xp": 40000},
    {"id": 26, "title": "Искатель контрактов", "league": "Уверенная элита", "xp": 50000},
    {"id": 27, "title": "Ветеран гвардии", "league": "Уверенная элита", "xp": 60000},
    {"id": 28, "title": "Тень Фрилансера", "league": "Уверенная элита", "xp": 70000},
    {"id": 29, "title": "Элитный наёмник", "league": "Уверенная элита", "xp": 80000},
    {"id": 30, "title": "Идеальный стрелок", "league": "Уверенная элита", "xp": 90000},
    {"id": 31, "title": "Живая легенда", "league": "Легенды", "xp": 110000},
    {"id": 32, "title": "Элитный стрелок", "league": "Легенды", "xp": 115000},
    {"id": 33, "title": "Хранитель рубежа", "league": "Легенды", "xp": 140000},
    {"id": 34, "title": "Легенда гвардии", "league": "Легенды", "xp": 180000},
    {"id": 35, "title": "Легендарный мастер", "league": "Легенды", "xp": 200000},
    {"id": 36, "title": "Стрелок виртуоз", "league": "Мастера арены", "xp": 250000},
    {"id": 37, "title": "Безмолвный исполнитель", "league": "Мастера арены", "xp": 270000},
    {"id": 38, "title": "Боевой фрилансер", "league": "Мастера арены", "xp": 290000},
    {"id": 39, "title": "Меткий профессионал", "league": "Мастера арены", "xp": 330000},
    {"id": 40, "title": "Властелин арены", "league": "Мастера арены", "xp": 380000},
    {"id": 41, "title": "Инквизитор промахов", "league": "Элита меткости", "xp": 450000},
    {"id": 42, "title": "Абсолютный-ас", "league": "Элита меткости", "xp": 470000},
    {"id": 43, "title": "Ветеран арены", "league": "Элита меткости", "xp": 500000},
    {"id": 44, "title": "Маршал тира", "league": "Элита меткости", "xp": 550000},
    {"id": 45, "title": "Тень элиты", "league": "Элита меткости", "xp": 600000},
    {"id": 46, "title": "Архиметкий", "league": "Эпическая лига", "xp": 700000},
    {"id": 47, "title": "Верховный мастер", "league": "Эпическая лига", "xp": 800000},
    {"id": 48, "title": "Призрак линии огня", "league": "Эпическая лига", "xp": 900000},
    {"id": 49, "title": "Великий Мастер", "league": "Эпическая лига", "xp": 1000000},
    {"id": 50, "title": "Титан тира", "league": "Эпическая лига", "xp": 1500000},
    {"id": 51, "title": "Абсолютный мастер", "league": "Абсолютная лига", "xp": 2100000},
    {"id": 52, "title": "Король тира", "league": "Абсолютная лига", "xp": 3000000},
    {"id": 53, "title": "Император точности", "league": "Абсолютная лига", "xp": 4000000},
    {"id": 54, "title": "Бессмертный стрелок", "league": "Бессмертные", "xp": 5500000},
    {"id": 55, "title": "Вечный чемпион", "league": "Бессмертные", "xp": 7500000},
    {"id": 56, "title": "Мифический мастер", "league": "Мифы арены", "xp": 9500000},
    {"id": 57, "title": "Бог точности", "league": "Мифы арены", "xp": 10500000},
    {"id": 58, "title": "Непревзойдённый", "league": "Мифы арены", "xp": 12000000},
    {"id": 59, "title": "Легенда всех времён", "league": "Пантеон", "xp": 15000000},
    {"id": 60, "title": "Вечная слава", "league": "Пантеон", "xp": 17000000}
];

// Функция получения звания по опыту
function getRankByXp(xp) {
    if (!RANKS.length) return { id: 0, title: "Без звания", league: "Новичок", xp: 0 };
    
    let currentRank = RANKS[0]; // Начинаем с первого звания
    
    for (const rank of RANKS) {
        if (xp >= rank.xp) {
            currentRank = rank; // Если опыта хватает на это звание, запоминаем его
        } else {
            break; // Как только опыта перестало хватать - выходим
        }
    }
    
    return currentRank;
}

// Функция получения следующего звания
function getNextRank(currentXp) {
    for (const rank of RANKS) {
        if (rank.xp > currentXp) {
            return rank; // Возвращаем первое звание, на которое не хватает опыта
        }
    }
    return null; // Достигнут максимум (60-е звание)
}

// Функция форматирования чисел (добавляет пробелы между разрядами)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Получаем данные игрока из localStorage
const player = JSON.parse(localStorage.getItem('holostim_player'));

// Если игрока нет - отправляем на онбординг
if (!player) {
    window.location.href = 'index.html';
}

// Добавляем опыт, если его нет (для теста можно задать значение)
// В реальности опыт будет приходить из бота или начисляться за сессии
if (player.xp === undefined) {
    player.xp = 25; // Тестовое значение - между 1 и 2 званием (10 и 30 XP)
}

// Добавляем статистику сессий, если её нет
if (player.sessions === undefined) {
    player.sessions = 12; // Тестовое значение
}

if (player.accuracy === undefined) {
    player.accuracy = 68; // Тестовое значение
}

// Получаем текущее и следующее звание
const currentRank = getRankByXp(player.xp);
const nextRank = getNextRank(player.xp);

// Расчет прогресса XP для шкалы
let xpProgress = 0;
let xpNeeded = 0;
let progressPercent = 0;

if (nextRank) {
    // Есть следующее звание
    xpNeeded = nextRank.xp - currentRank.xp;
    xpProgress = player.xp - currentRank.xp;
    progressPercent = (xpProgress / xpNeeded) * 100;
} else {
    // Достигнут максимум (60-е звание)
    progressPercent = 100;
}

// Обновляем элементы интерфейса
// Основная информация
document.getElementById('nickname').innerText = player.nickname || 'PLAYER';

// Проверяем, есть ли новый элемент rankTitle (если нет, используем level)
const rankTitleElement = document.getElementById('rankTitle');
if (rankTitleElement) {
    rankTitleElement.innerText = currentRank.title;
} else {
    // Для обратной совместимости
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.innerText = currentRank.title;
    }
}

// Лига
document.getElementById('league').innerText = currentRank.league;

// Следующее звание (если есть такой элемент)
const nextRankElement = document.getElementById('nextRank');
const xpNeededElement = document.getElementById('xpNeeded');

if (nextRankElement) {
    if (nextRank) {
        nextRankElement.innerText = nextRank.title;
    } else {
        nextRankElement.innerText = 'МАКСИМУМ';
    }
}

if (xpNeededElement) {
    if (nextRank) {
        const needed = nextRank.xp - player.xp;
        xpNeededElement.innerHTML = `нужно ${formatNumber(needed)} XP`;
    } else {
        xpNeededElement.innerHTML = 'высшее звание';
    }
}

// Шкала XP
const xpFill = document.getElementById('xpFill');
if (xpFill) {
    xpFill.style.width = progressPercent + '%';
}

// Текст XP
const xpText = document.getElementById('xpText');
if (xpText) {
    if (nextRank) {
        xpText.innerHTML = `${formatNumber(player.xp)} / ${formatNumber(nextRank.xp)} XP`;
    } else {
        xpText.innerHTML = `${formatNumber(player.xp)} XP (МАКСИМУМ)`;
    }
}

// Статистика (сессии и точность)
const sessionsCount = document.getElementById('sessionsCount');
const accuracyElement = document.getElementById('accuracy');

if (sessionsCount) {
    sessionsCount.innerText = player.sessions || 0;
}

if (accuracyElement) {
    accuracyElement.innerText = (player.accuracy || 0) + '%';
}

// Фон по полу
const bg = document.getElementById('account-bg');

if (bg) {
    if (player.gender === 'male') {
        bg.style.backgroundImage = "url('assets/img/wick_male.jpg')";
    } else if (player.gender === 'female') {
        bg.style.backgroundImage = "url('assets/img/wick_female.jpg')";
    } else {
        // Если пол не выбран, ставим градиент
        bg.style.background = "linear-gradient(135deg, #1a1a2e, #16213e)";
    }
}

// Кнопка сброса (dev режим)
const resetBtn = document.getElementById('dev-reset-btn');

if (resetBtn) {
    resetBtn.onclick = () => {
        if (confirm('Сбросить аккаунт? Весь прогресс будет потерян.')) {
            localStorage.removeItem('holostim_player');
            window.location.href = 'index.html';
        }
    };
}

// Функция начала боя (будет вызвана из HTML)
window.startBattle = function() {
    // Здесь можно добавить анимацию или звук
    alert('⚡ РЕЖИМ БОЯ\n\nСкоро ты сможешь зарабатывать XP и открывать новые звания!');
    
    // Для теста можно добавить опыт
    // player.xp += 10;
    // localStorage.setItem('holostim_player', JSON.stringify(player));
    // location.reload(); // Перезагружаем страницу для обновления данных
};

// Сохраняем обновленные данные игрока обратно в localStorage
// (чтобы сохранить тестовые значения)
localStorage.setItem('holostim_player', JSON.stringify(player));

// Выводим в консоль для отладки (можно удалить в продакшене)
console.log('Player data:', player);
console.log('Current rank:', currentRank);
console.log('Next rank:', nextRank);
console.log('XP progress:', xpProgress, '/', xpNeeded, '(', progressPercent.toFixed(1), '%)');