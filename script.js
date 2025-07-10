const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const backgroundImg = new Image();
backgroundImg.src = 'assets/space-bg.png';
const spaceshipImg = new Image();
spaceshipImg.src = 'assets/spaceship.png';
const alienImg = new Image();
alienImg.src = 'assets/alien.png';
const bulletImg = new Image();
bulletImg.src = 'assets/bullet.png';
const shootSound = new Audio('assets/laser.wav');
const explosionSound = new Audio('assets/explosion.wav');

let playerX = 370;
let playerY = 480;
let bullets = [];
let enemies = [];
let numberOfEnemies = 3;
let score = 0;
let keys = {};
let playerName = "";
let bulletState = 'ready';
let isPaused = false;
let animationId = null;

// Create enemies
for (let i = 0; i < numberOfEnemies; i++) {
  enemies.push({
    x: Math.random() * 760,
    y: Math.random() * 100 + 50,
    xChange: 3,
    yChange: 20
  });
}

// Controls
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  if (e.key === ' ' && bulletState === 'ready') {
    bullets.push({ x: playerX + 16, y: playerY });
    shootSound.play();
    bulletState = 'fire';
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Drawing
function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}
function drawPlayer() {
  ctx.drawImage(spaceshipImg, playerX, playerY, 64, 64);
}
function drawEnemy(enemy) {
  ctx.drawImage(alienImg, enemy.x, enemy.y, 64, 64);
}
function drawBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    ctx.drawImage(bulletImg, b.x, b.y, 32, 32);
    b.y -= 10;
    if (b.y < 0) {
      bullets.splice(i, 1);
      bulletState = 'ready';
    }
  }
}
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '24px sans-serif';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Game Loop
function gameLoop() {
  drawBackground();

  if (keys['ArrowLeft']) playerX -= 5;
  if (keys['ArrowRight']) playerX += 5;
  playerX = Math.max(0, Math.min(canvas.width - 64, playerX));

  drawPlayer();
  drawBullets();

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
      saveScore(playerName, score);
      showLeaderboard();
      return;
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      const dx = bullets[j].x - e.x;
      const dy = bullets[j].y - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) {
        explosionSound.play();
        bullets.splice(j, 1);
        bulletState = 'ready';
        score++;
        document.getElementById("scoreDisplay").innerText = "Score: " + score;

        e.x = Math.random() * 760;
        e.y = Math.random() * 100 + 50;
        break;
      }
    }

    drawEnemy(e);
  }

  drawScore();

  if (!isPaused) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Start game
function startGame() {
  const input = document.getElementById("playerName");
  if (!input.value.trim()) {
    alert("Please enter your name.");
    return;
  }
  playerName = input.value.trim();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";
  document.getElementById("scoreDisplay").style.display = "block";
  document.getElementById("instructions").style.display = "block";
  document.getElementById("pauseBtn").style.display = "block";
  gameLoop();
}

// Pause/Resume button
window.onload = () => {
  const pauseBtn = document.getElementById("pauseBtn");
  pauseBtn.addEventListener("click", () => {
    if (isPaused) {
      isPaused = false;
      pauseBtn.innerText = "Pause";
      gameLoop();
    } else {
      isPaused = true;
      pauseBtn.innerText = "Resume";
      cancelAnimationFrame(animationId);
    }
  });
};

// Leaderboard
function saveScore(name, score) {
  let scores = JSON.parse(localStorage.getItem("highScores")) || [];
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);
  localStorage.setItem("highScores", JSON.stringify(scores));
}

function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("highScores")) || [];
  let msg = "🏆 Top 5 Scores:\n";
  scores.forEach((s, i) => {
    msg += `${i + 1}. ${s.name}: ${s.score}\n`;
  });
  alert(msg);
}

window.startGame = startGame;
