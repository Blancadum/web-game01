// Seleccionar el canvas y obtener el contexto 2D
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Variables de estado del juego, temporizador, vidas y nivel
let gameRunning = false;
let timerInterval;
let secondsElapsed = 0;
let lives = 3; // Vidas iniciales
let level = 1; // Nivel inicial

// Configuración de la pelota y paletas
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
const ballRadius = 10;

// Dimensiones de las paletas
const paddleWidth = 10;
const paddleHeight = 100;

// Posiciones iniciales de las paletas
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 4;
const maxBounceAngle = Math.PI / 4; // Máximo ángulo de rebote en radianes



document.addEventListener("DOMContentLoaded", function() {    
    // Asegura que la sección de juego y el botón de empezar sean visibles al cargar la página
    checkSectionVisibility();
    // Evento para mostrar la sección de juego al hacer clic en el botón con ID "click"
    document.getElementById('click').addEventListener('click', function() {
        checkSectionVisibility();
    });

    // Evento para iniciar el juego al hacer clic en el botón con ID "startButton"
    document.getElementById('startButton').onclick = () => {
        gameRunning = true;
        startTimer();
        gameLoop();
        document.getElementById('startButton').classList.add('hidden');
    };

    // Configuración de eventos para reiniciar el juego al hacer clic en el botón con ID "restartButton"
    document.getElementById('restartButton').addEventListener('click', () => {
        document.getElementById('gameOverModal').classList.add('hidden');
        resetGame();
    });
});

// Función para dibujar la pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

// Función para dibujar las paletas
function drawPaddle(x, y) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

// Función para limpiar y dibujar el canvas en cada frame
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(0, leftPaddleY); // Paleta izquierda
    drawPaddle(canvas.width - paddleWidth, rightPaddleY); // Paleta derecha
}

// Función para actualizar la posición de la pelota y verificar colisiones
function updateBallPosition() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisión con el borde superior e inferior del canvas
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Colisión con la paleta izquierda
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        handlePaddleCollision("left");
    }

    // Colisión con la paleta derecha
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        handlePaddleCollision("right");
    }

    // Si la pelota sale por los lados izquierdo o derecho
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        lives--; // Reducir una vida
        updateLivesDisplay(); // Actualizar el número de vidas en el HTML
        stopGame(); // Detener el juego
        stopTimer(); // Detener el temporizador

        if (lives > 0) {
            showContinueButton(); // Mostrar el botón "Continuar" si quedan vidas
        } else {
            showGameOver(); // Mostrar "Game Over" si no quedan vidas
        }
    }
}

// Función para manejar la colisión de la pelota con las paletas
function handlePaddleCollision(paddle) {
    let paddleY = paddle === "left" ? leftPaddleY : rightPaddleY;
    let impactPoint = (ballY - (paddleY + paddleHeight / 2)) / (paddleHeight / 2);
    impactPoint = Math.max(-1, Math.min(1, impactPoint)); 

    let bounceAngle = impactPoint * maxBounceAngle;
    ballSpeedY = Math.sin(bounceAngle) * Math.abs(ballSpeedX); 
    ballSpeedX = -ballSpeedX * 1.05; 

    ballX = paddle === "left" ? paddleWidth + ballRadius : canvas.width - paddleWidth - ballRadius;
}

// Función para reiniciar la posición de la pelota en el centro del canvas
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = Math.random() < 0.5 ? 2 : -2;
    ballSpeedY = (Math.random() * 2 - 1) * 3;
}

// Bucle principal del juego
function gameLoop() {
    if (!gameRunning) return;
    draw(); 
    updateBallPosition(); 
    requestAnimationFrame(gameLoop);
}

// Función para detener el juego
function stopGame() {
    gameRunning = false;
    stopTimer(); 
}

// Otras funciones de control y lógica del juego 
function updateLevelDisplay() {
    document.querySelector('#levelDisplay span').textContent = level;
}

function updateLivesDisplay() {
    document.querySelector('#playerLives span').textContent = lives;
}

function startTimer() {
    clearInterval(timerInterval); 
    timerInterval = setInterval(() => {
        if (gameRunning) { 
            secondsElapsed++;
            const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
            const seconds = String(secondsElapsed % 60).padStart(2, '0');
            document.querySelector('#timeDisplay span').textContent = `${minutes}:${seconds}`;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Función para mostrar el botón "Continuar"
function showContinueButton() {
    const continueButton = document.getElementById('continueButton');
    continueButton.classList.remove('hidden');
    continueButton.onclick = () => {
        continueButton.classList.add('hidden'); // Ocultar el botón después de hacer clic
        resetBall(); // Colocar la pelota en el centro del canvas
        gameRunning = true; // Reiniciar el juego
        startTimer(); // Reiniciar el temporizador
        gameLoop(); // Reanudar el bucle del juego
    };
}

// Función para mostrar el "Game Over"
function showGameOver() {
    console.log("Función showGameOver llamada");
    const gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.classList.remove('hidden');
}

// Función para reiniciar el juego
function resetGame() {
    lives = 3;
    level = 1;
    resetBall();
    updateLevelDisplay();
    updateLivesDisplay();
    secondsElapsed = 0;
    gameRunning = true;
    startTimer();
    gameLoop();
}

// Función para controlar la visibilidad de la sección de juego y la pantalla de inicio
/*function checkSectionVisibility() {
    document.getElementById('playWindow').classList.remove('hidden'); 
    document.getElementById('coverScreen').classList.add('hidden'); 
    document.getElementById('startButton').classList.remove('hidden'); 
    
};*/

function checkSectionVisibility() {

document.getElementById('playWindow').classList.remove('hidden'); 
document.getElementById('coverScreen').classList.add('hidden'); 

// Asegúrate de que el botón "Empezar a jugar" sea visible
const startButton = document.getElementById('startButton');
startButton.classList.remove('hidden'); 
}

