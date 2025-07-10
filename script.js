
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const backgroundImg = new Image();
backgroundImg.src = 'assets/space-bg.png';
const spaceshipImg = new Image();
spaceshipImg.src = 'assets/spaceship.png';
const alienImg = new Image();
alienImg.src = 'assets/spaceship.png'; // Placeholder
const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';
const shootSound = new Audio('assets/laser.wav');
const explosionSound = new Audio('assets/laser.wav');

let playerX = 370;
let playerY = 480;
let playerXChange = 0;

let bulletX = 0;
let bulletY = 480;
let bulletYChange = 10;
let bulletState = 'ready';

let enemies = [];
let numberOfEnemies = 3;
for (let i = 0; i < numberOfEnemies; i++) {
  enemies.push({
    x: Math.random() * 760,
    y: Math.random() * 100 + 50,
    xChange: 3,
    yChange: 20
  });
}

let score = 0;
let keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === ' ') {
    if (bulletState === 'ready') {
      shootSound.play();
      bulletX = playerX + 10;
      bulletState = 'fire';
    }
  }
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}
function drawPlayer() {
  ctx.drawImage(spaceshipImg, playerX, playerY, 64, 64);
}
function drawEnemy(enemy) {
  ctx.drawImage(alienImg, enemy.x, enemy.y, 64, 64);
}
function drawBullet() {
  ctx.drawImage(bulletImg, bulletX, bulletY, 32, 32);
}
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px sans-serif';
  ctx.fillText('Score: ' + score, 10, 30);
}
function isCollision(enemy) {
  const dx = bulletX - enemy.x;
  const dy = bulletY - enemy.y;
  return Math.sqrt(dx * dx + dy * dy) < 30;
}
function gameLoop() {
  drawBackground();
  if (keys['ArrowLeft']) playerX -= 5;
  if (keys['ArrowRight']) playerX += 5;
  if (playerX < 0) playerX = 0;
  if (playerX > canvas.width - 64) playerX = canvas.width - 64;
  drawPlayer();
  if (bulletState === 'fire') {
    drawBullet();
    bulletY -= bulletYChange;
    if (bulletY <= 0) {
      bulletY = playerY;
      bulletState = 'ready';
    }
  }
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    e.x += e.xChange;
    if (e.x <= 0 || e.x >= canvas.width - 64) {
      e.xChange *= -1;
      e.y += e.yChange;
    }
    if (e.y > 440) {
      ctx.fillStyle = 'white';
      ctx.font = '40px sans-serif';
      ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
      return;
    }
    if (isCollision(e)) {
      explosionSound.play();
      bulletY = 480;
      bulletState = 'ready';
      score++;
      enemies[i] = {
        x: Math.random() * 760,
        y: Math.random() * 100 + 50,
        xChange: 3,
        yChange: 20
      };
    }
    drawEnemy(e);
  }
  drawScore();
  requestAnimationFrame(gameLoop);
}
gameLoop();
