const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();

        if (keys.ArrowUp && this.y - this.radius > 0) this.y -= this.speed;
        if (keys.ArrowDown && this.y + this.radius < canvas.height) this.y += this.speed;
        if (keys.ArrowLeft && this.x - this.radius > 0) this.x -= this.speed;
        if (keys.ArrowRight && this.x + this.radius < canvas.width) this.x += this.speed;
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
};

let player;
let projectiles = [];
let enemies = [];
let score = 0;
let animationId;
let spawnIntervalId;

function init() {
    player = new Player(canvas.width / 2, canvas.height / 2, 15, 'white');
    projectiles = [];
    enemies = [];
    score = 0;
    scoreEl.innerHTML = 'Score: 0';
    gameOverEl.style.display = 'none';
}

function spawnEnemies() {
    spawnIntervalId = setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10;
        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(
            player.y - y,
            player.x - x
        );
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

window.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
    if (event.key === 'w') keys.ArrowUp = true;
    if (event.key === 'a') keys.ArrowLeft = true;
    if (event.key === 's') keys.ArrowDown = true;
    if (event.key === 'd') keys.ArrowRight = true;

    if (event.code === 'Space') {
        projectiles.push(new Projectile(
            player.x,
            player.y,
            5,
            'white',
            { x: 0, y: -10 }
        ));
    }
});

window.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
    if (event.key === 'w') keys.ArrowUp = false;
    if (event.key === 'a') keys.ArrowLeft = false;
    if (event.key === 's') keys.ArrowDown = false;
    if (event.key === 'd') keys.ArrowRight = false;
});

window.addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - player.y,
        event.clientX - player.x
    );
    const velocity = {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10
    };
    projectiles.push(new Projectile(
        player.x,
        player.y,
        5,
        'white',
        velocity
    ));
});

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.update();

        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            projectiles.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();

        const distToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (distToPlayer - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            clearInterval(spawnIntervalId);
            gameOverEl.style.display = 'block';
            finalScoreEl.innerHTML = score;
        }

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const projectile = projectiles[j];
            const distToProjectile = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            if (distToProjectile - enemy.radius - projectile.radius < 1) {
                enemies.splice(i, 1);
                projectiles.splice(j, 1);
                score += 100;
                scoreEl.innerHTML = `Score: ${score}`;
                break;
            }
        }
    }
}

restartButton.addEventListener('click', () => {
    init();
    animate();
    spawnEnemies();
});

init();
animate();
spawnEnemies();
