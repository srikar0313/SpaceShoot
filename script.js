
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 640;

// Load assets
const spaceshipImg = new Image();
spaceshipImg.src = 'spaceship.png';
const alienImg = new Image();
alienImg.src = 'assets/alien.png';
const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';
const shootSound = new Audio('assets/shoot.wav');
const explosionSound = new Audio('assets/explosion.wav');

let spaceshipX = canvas.width / 2 - 20;
let spaceshipY = canvas.height - 60;
let bullets = [];
let enemies = [];
let score = 0;

let keys = {};
let enemyDirection = 1; // 1 = right, -1 = left

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === " ") {
    bullets.push({ x: spaceshipX + 15, y: spaceshipY });
    shootSound.play();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function drawSpaceship() {
  ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY, 40, 40);
}

function drawBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= 8;
    ctx.drawImage(bulletImg, bullets[i].x, bullets[i].y, 15, 15);
    if (bullets[i].y < 0) bullets.splice(i, 1);
  }
}

function drawEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].x += 1.5 * enemyDirection;
    ctx.drawImage(alienImg, enemies[i].x, enemies[i].y, 30, 30);

    // Reverse direction if enemy hits bounds
    if (enemies[i].x <= 0 || enemies[i].x >= canvas.width - 30) {
      enemyDirection *= -1;
      for (let j = 0; j < enemies.length; j++) {
        enemies[j].y += 10; // Move down slightly
      }
      break;
    }

    if (enemies[i].y > canvas.height - 40) {
      alert("Game Over!");
      document.location.reload();
    }
  }
}

function detectCollisions() {
  for (let b = bullets.length - 1; b >= 0; b--) {
    for (let e = enemies.length - 1; e >= 0; e--) {
      let dx = Math.abs(bullets[b].x - enemies[e].x);
      let dy = Math.abs(bullets[b].y - enemies[e].y);
      if (dx < 20 && dy < 20) {
        bullets.splice(b, 1);
        enemies.splice(e, 1);
        score += 10;
        explosionSound.play();
        document.getElementById("scoreDisplay").innerText = "Score: " + score;
        break;
      }
    }
  }
}

function moveSpaceship() {
  if (keys["ArrowLeft"]) spaceshipX -= 6;
  if (keys["ArrowRight"]) spaceshipX += 6;
  spaceshipX = Math.max(0, Math.min(canvas.width - 40, spaceshipX));
}

function spawnEnemies() {
  if (Math.random() < 0.015) {
    const x = Math.random() * (canvas.width - 30);
    enemies.push({ x, y: 0 });
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSpaceship();
  drawSpaceship();
  drawBullets();
  drawEnemies();
  detectCollisions();
  spawnEnemies();
  requestAnimationFrame(gameLoop);
}

gameLoop();
