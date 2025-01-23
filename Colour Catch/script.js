const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');

let timeLeft = 30;
let animationFrameId;
const balls = [];

class Ball {
    constructor(x, y, radius, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.speedX *= -1;
        }

        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.speedY *= -1;
        }

        this.draw();
    }
}

function createBall() {
    const radius = Math.random() * 20 + 10;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    const speedX = (Math.random() - 0.5) * 4;
    const speedY = (Math.random() - 0.5) * 4;

    balls.push(new Ball(x, y, radius, color, speedX, speedY));
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    balls.forEach((ball, index) => {
        const distance = Math.hypot(ball.x - mouseX, ball.y - mouseY);
        if (distance < ball.radius) {
            balls.splice(index, 1);
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    });
});

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    cancelAnimationFrame(animationFrameId);
    clearInterval(ballInterval);
    clearInterval(timerInterval);

    finalScore.textContent = score;
    gameOverScreen.style.display = 'block';
}

function restartGame() {
    score = 0;
    timeLeft = 30;
    balls.length = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    gameOverScreen.style.display = 'none';

    ballInterval = setInterval(createBall, 1000);
    timerInterval = setInterval(updateTimer, 1000);
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => ball.update());
    animationFrameId = requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let ballInterval = setInterval(createBall, 1000);
let timerInterval = setInterval(updateTimer, 1000);

animate();