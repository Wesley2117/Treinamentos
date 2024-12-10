const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    hp: 100,
    level: 1,
    score: 0,
    inventory: [],
    image: new Image(),
    attack: false,
    attackDamage: 20
};
player.image.src = '../Gamedoano/img/player01.png';

let enemies = [];
let items = [];
let keys = {};

const bgMusic = document.getElementById("bg-music");
bgMusic.play(); // Inicia música de fundo

document.addEventListener("keydown", (e) => {
    if (e.key === " ") { // Se pressionar a barra de espaço
        player.attack = true;
    }
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === " ") { // Desativa o ataque após soltar a barra de espaço
        player.attack = false;
    }
    keys[e.key] = false;
});

function movePlayer() {
    if (keys["ArrowUp"] || keys["w"]) {
        player.dy = -player.speed;
    } else if (keys["ArrowDown"] || keys["s"]) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }

    if (keys["ArrowLeft"] || keys["a"]) {
        player.dx = -player.speed;
    } else if (keys["ArrowRight"] || keys["d"]) {
        player.dx = player.speed;
    } else {
        player.dx = 0;
    }

    // Impede o jogador de sair da tela
    if (player.x + player.dx >= 0 && player.x + player.width + player.dx <= canvas.width) {
        player.x += player.dx;
    }
    if (player.y + player.dy >= 0 && player.y + player.height + player.dy <= canvas.height) {
        player.y += player.dy;
    }
}

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function spawnEnemy() {
    if (Math.random() < 0.01) { // Menor probabilidade de spawn
        const size = 50;
        const x = Math.random() * (canvas.width - size);
        const y = Math.random() * (canvas.height - size);
        const type = Math.random() < 0.5 ? "normal" : "shooter"; // Normal or shooter
        enemies.push({ x, y, width: size, height: size, color: "red", type, dx: Math.random() * 2 - 1, dy: Math.random() * 2 - 1, image: new Image() });
        enemies[enemies.length - 1].image.src = '../Gamedoano/img/inimigo.png'; // Normal enemy sprite
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function spawnItem() {
    if (Math.random() < 0.002) { // Menor probabilidade de spawn
        const size = 30;
        const x = Math.random() * (canvas.width - size);
        const y = Math.random() * (canvas.height - size);
        items.push({ x, y, width: size, height: size, type: "health", image: new Image() });
        items[items.length - 1].image.src = '../Gamedoano/img/item1.png'; // Item sprite
    }
}

function drawItems() {
    items.forEach(item => {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
    });
}

function detectCollisions() {
    enemies.forEach((enemy, index) => {
        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            player.hp -= enemy.type === "shooter" ? 30 : 10; // Maior dano para inimigos do tipo "shooter"
            enemies.splice(index, 1);
            updateHud();
        }
    });

    items.forEach((item, index) => {
        if (player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y) {
            if (item.type === "health") {
                player.hp = Math.min(player.hp + 20, 100);
            }
            items.splice(index, 1);
            player.inventory.push(item.type);
            updateHud();
        }
    });
}

function updateHud() {
    document.getElementById("life").textContent = `Vida: ${player.hp}`;
    document.getElementById("level").textContent = `Nível: ${player.level}`;
    document.getElementById("score").textContent = `Pontuação: ${player.score}`;
    document.getElementById("inventory").textContent = `Inventário: ${player.inventory.join(", ") || "Nenhum item"}`;
}

function attackEnemy() {
    if (player.attack) {
        enemies.forEach((enemy, index) => {
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                player.attack = false; // Desativa o ataque após uma interação
                enemy.hp -= player.attackDamage; // Dano causado pelo ataque do jogador
                if (enemy.hp <= 0) {
                    enemies.splice(index, 1);
                    player.score += 50;
                }
            }
        });
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;

        // Colisão com as bordas da tela
        if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
            enemy.dx *= -1;
        }
        if (enemy.y <= 0 || enemy.y >= canvas.height - enemy.height) {
            enemy.dy *= -1;
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    spawnEnemy();
    drawEnemies();
    spawnItem();
    drawItems();
    detectCollisions();
    moveEnemies();
    attackEnemy();

    player.score += 1;

    if (player.score >= 100 * player.level) {
        player.level++;
        player.hp = 100;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
