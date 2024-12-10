document.addEventListener("DOMContentLoaded", () => {
    // Configuração inicial do Canvas
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    
    // Variáveis de Jogo
    let player = { x: 50, y: 500, width: 40, height: 40, color: 'red', speed: 5 };
    let enemies = [];
    let traps = [];
    let lives = 3;
    let level = 1;
    let timeRemaining = 30;
    let isGameRunning = true;
    let gameInterval;
    
    // Função para gerar inimigos
    function spawnEnemies(count) {
        enemies = [];
        for (let i = 0; i < count; i++) {
            enemies.push({
                x: Math.random() * (canvas.width - 40),
                y: Math.random() * (canvas.height - 40),
                width: 30,
                height: 30,
                color: 'purple',
                speed: 2 + Math.random() * 2, // Velocidade aleatória
                directionX: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2),
                directionY: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2),
            });
        }
    }

    // Função para gerar armadilhas
    function spawnTraps(count) {
        traps = [];
        for (let i = 0; i < count; i++) {
            traps.push({
                x: Math.random() * (canvas.width - 30),
                y: Math.random() * (canvas.height - 30),
                width: 30,
                height: 30,
                color: 'black',
            });
        }
    }

    // Desenhar o jogador
    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Desenhar os inimigos
    function drawEnemies() {
        enemies.forEach((enemy) => {
            ctx.fillStyle = enemy.color;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            enemy.x += enemy.directionX;
            enemy.y += enemy.directionY;
            if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
                enemy.directionX *= -1;
            }
            if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
                enemy.directionY *= -1;
            }
        });
    }

    // Desenhar as armadilhas
    function drawTraps() {
        traps.forEach((trap) => {
            ctx.fillStyle = trap.color;
            ctx.beginPath();
            ctx.arc(trap.x + trap.width / 2, trap.y + trap.height / 2, trap.width / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Movimentar o jogador (usando W, A, S, D)
    function movePlayer(keys) {
        if (keys['w'] && player.y > 0) player.y -= player.speed;
        if (keys['s'] && player.y < canvas.height - player.height) player.y += player.speed;
        if (keys['a'] && player.x > 0) player.x -= player.speed;
        if (keys['d'] && player.x < canvas.width - player.width) player.x += player.speed;
    }

    // Checar colisões com inimigos
    function checkEnemyCollisions() {
        enemies.forEach((enemy) => {
            const collides =
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y;

            if (collides) {
                lives--;
                document.getElementById('lives').textContent = lives;
                resetPlayer();
            }
        });
    }

    // Checar colisões com armadilhas
    function checkTrapCollisions() {
        traps.forEach((trap) => {
            const collides =
                player.x < trap.x + trap.width &&
                player.x + player.width > trap.x &&
                player.y < trap.y + trap.height &&
                player.y + player.height > trap.y;

            if (collides) {
                lives--;
                document.getElementById('lives').textContent = lives;
                resetPlayer();
            }
        });
    }

    // Função para atualizar o estado do jogo
    function update(keys) {
        if (!isGameRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        movePlayer(keys);
        drawPlayer();
        drawEnemies();
        drawTraps();
        checkEnemyCollisions();
        checkTrapCollisions();
        document.getElementById('time-remaining').textContent = timeRemaining;
    }

    // Função do loop de jogo
    function gameLoop() {
        update(keys);
        requestAnimationFrame(gameLoop);
    }

    // Iniciar contagem do tempo
    function startTimer() {
        gameInterval = setInterval(() => {
            if (timeRemaining <= 0) {
                level++;
                document.getElementById('level').textContent = level;
                timeRemaining = 30 + (level - 1) * 15; // Aumenta o tempo a cada nível
                spawnEnemies(level + 2);  // Aumenta a quantidade de inimigos
                spawnTraps(level + 2);    // Aumenta a quantidade de armadilhas
            } else {
                timeRemaining--;
            }
        }, 1000);
    }

    // Reiniciar o jogador
    function resetPlayer() {
        if (lives <= 0) {
            alert("Game Over!");
            lives = 3;
            level = 1;
            timeRemaining = 30;
        }
        player.x = 50;
        player.y = 500;
    }

    // Iniciar o jogo
    function startGame() {
        document.getElementById('player-name').textContent = 'Ruby';
        spawnEnemies(3);
        spawnTraps(3);
        startTimer();
        gameLoop();
    }

    // Variáveis para controle de teclas
    let keys = {};
    window.addEventListener('keydown', (e) => (keys[e.key.toLowerCase()] = true));
    window.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));

    startGame(); // Iniciar o jogo
});
