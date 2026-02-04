const player = JSON.parse(localStorage.getItem('holostim_player'));

if (!player) {
  window.location.href = 'index.html';
}

document.getElementById('nickname').innerText = player.nickname;
document.getElementById('level').innerText = 'Уровень ' + player.level;
document.getElementById('league').innerText = player.league;

// фон по полу
const bg = document.getElementById('account-bg');

if (player.gender === 'male') {
  bg.style.backgroundImage = "url('assets/img/wick_male.jpg')";
} else {
  bg.style.backgroundImage = "url('assets/img/wick_female.jpg')";
}
