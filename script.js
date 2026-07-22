// --- EFECTOS DE SONIDO ---
const flipSound = new Audio('images/flip.mp3');
const matchSound = new Audio('images/match.mp3');
const failSound = new Audio('images/fail.mp3');
const shuffleSound = new Audio('images/shuffle.mp3');
const victorySound = new Audio('images/victory.mp3');

// --- VARIABLES DE ESTADO ---
let flippedCards = [];
let moves = 0;
let matches = 0;
let lockBoard = false;

// Variables de Temporizador y Modo
let timerInterval = null;
let secondsElapsed = 0;
let currentMode = 'libre';

// Referencias al DOM
const tablero = document.getElementById('grid-container');
const movesElement = document.getElementById('moves');
const matchesElement = document.getElementById('matches');
const btnRepartir = document.getElementById('restart-btn');
const btnTextElement = document.getElementById('btn-text');
const victoryModal = document.getElementById('victory-modal');
const btnPlayAgain = document.getElementById('play-again-btn');

const gameModeSelect = document.getElementById('gameMode');
const timerContainer = document.getElementById('timerContainer');
const timerDisplay = document.getElementById('timerDisplay');
const modeSelectorContainer = document.getElementById('modeSelectorContainer');

// --- EVENTO: CAMBIO DE MODO DE JUEGO ---
if (gameModeSelect) {
  gameModeSelect.addEventListener('change', (e) => {
    currentMode = e.target.value;
    if (currentMode === 'cronometro') {
      timerContainer.classList.remove('d-none');
    } else {
      timerContainer.classList.add('d-none');
    }
    resetTimer();
  });
}

// --- FUNCIONES DEL CRONÓMETRO ---
function startTimer() {
  stopTimer();
  secondsElapsed = 0;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  secondsElapsed = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
  const secs = (secondsElapsed % 60).toString().padStart(2, '0');
  if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
}

// --- CAMBIAR FONDO ALEATORIO ---
function cambiarFondoAleatorio() {
    const randomBgSeed = Math.floor(Math.random() * 5000);
    const bgUrl = `https://picsum.photos/seed/bg_${randomBgSeed}/1920/1080`;
    document.body.style.backgroundImage = `url('${bgUrl}')`;
}

// --- GENERAR IMÁGENES ALEATORIAS ---
function obtenerNuevasImagenes() {
    const randomSeed = Math.floor(Math.random() * 10000);
    const imagenes = [];
    for (let i = 1; i <= 6; i++) {
        imagenes.push(`https://picsum.photos/seed/${randomSeed}_foto${i}/300/400`);
    }
    return imagenes;
}

// --- INICIAR / REINICIAR EL JUEGO ---
function initGame() {
    // Quitar portada
    document.body.classList.remove('game-idle');
    
    // Ocultar selector de modo durante la partida
    if (modeSelectorContainer) {
        modeSelectorContainer.classList.add('d-none');
    }

    // Iniciar cronómetro si está en modo cronómetro
    if (currentMode === 'cronometro') {
        if (timerContainer) timerContainer.classList.remove('d-none');
        startTimer();
    } else {
        if (timerContainer) timerContainer.classList.add('d-none');
        resetTimer();
    }

    // Cambiar texto del botón a "Reiniciar"
    if (btnTextElement) {
        btnTextElement.textContent = 'Reiniciar';
    }

    cambiarFondoAleatorio();
    
    if (victoryModal) {
        victoryModal.classList.add('hidden');
    }

    shuffleSound.currentTime = 0;
    shuffleSound.play().catch(() => {});

    // Resetear contadores
    moves = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;

    if (movesElement) movesElement.textContent = '0';
    if (matchesElement) matchesElement.textContent = '0/6';

    const imagenesBase = obtenerNuevasImagenes();
    let mazo = [...imagenesBase, ...imagenesBase];
    mazo.sort(() => Math.random() - 0.5);

    renderizarTablero(mazo);
}

// --- DIBUJAR TABLERO ---
function renderizarTablero(mazo) {
    if (!tablero) return;
    tablero.innerHTML = '';

    mazo.forEach((url, index) => {
        const colNode = document.createElement('div');
        colNode.className = 'col d-flex justify-content-center';

        const cardNode = document.createElement('div');
        cardNode.className = 'game-card dealing';
        cardNode.dataset.image = url;

        cardNode.innerHTML = `
            <div class="card-back"></div>
            <div class="card-front">
                <img src="${url}" alt="Carta ${index + 1}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
            </div>
        `;

        cardNode.addEventListener('click', () => voltearCarta(cardNode));
        colNode.appendChild(cardNode);
        tablero.appendChild(colNode);
    });
}

// --- VOLTEAR CARTA ---
function voltearCarta(card) {
    if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    flipSound.currentTime = 0;
    flipSound.play().catch(() => {});

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        comprobarPareja();
    }
}

// --- COMPROBAR PAREJA ---
function comprobarPareja() {
    moves++;
    if (movesElement) movesElement.textContent = moves;

    const [carta1, carta2] = flippedCards;
    const esIgual = carta1.dataset.image === carta2.dataset.image;

    if (esIgual) {
        matchSound.currentTime = 0;
        matchSound.play().catch(() => {});

        carta1.classList.add('matched');
        carta2.classList.add('matched');
        matches++;

        if (matchesElement) matchesElement.textContent = `${matches}/6`;
        flippedCards = [];

        // VICTORIA
        if (matches === 6) {
            stopTimer();
            setTimeout(() => {
                victorySound.currentTime = 0;
                victorySound.play().catch(() => {});

                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                }

                // Elementos del modal de puntuación
const iconModal = document.querySelector('.modal-content-custom img');
const titleModal = document.querySelector('.modal-title-text');
const scoreDisplayGroup = document.getElementById('finalScoreDisplay')?.parentElement;
const leaderboardContainer = document.querySelector('.leaderboard-container');

// Restaurar visibilidad por si se consultó el ranking en la portada previamente
if (iconModal) iconModal.classList.remove('d-none');
if (titleModal) titleModal.classList.remove('d-none');
if (btnPlayAgain) btnPlayAgain.textContent = '¿Jugar de nuevo?';

// Calculamos puntaje y mostramos ranking en ambos modos
calcularPuntaje();
if (scoreDisplayGroup) scoreDisplayGroup.classList.remove('d-none');
if (scoreSaveContainer) scoreSaveContainer.classList.remove('d-none');
if (leaderboardContainer) leaderboardContainer.classList.remove('d-none');

// Actualizamos el título del ranking según el modo jugado
const leaderboardTitle = document.querySelector('.leaderboard-container h6');
if (leaderboardTitle) {
    leaderboardTitle.textContent = currentMode === 'cronometro' 
        ? '🏆 Top 5 Récords (Cronómetro)' 
        : '🏆 Top 5 Récords (Modo Libre)';
}

actualizarLeaderboardUI();

if (victoryModal) {
    victoryModal.classList.remove('hidden');
}
            }, 500);
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            failSound.currentTime = 0;
            failSound.play().catch(() => {});

            carta1.classList.remove('flipped');
            carta2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 900);
    }
}

// --- EVENTOS INICIALES ---
document.addEventListener('DOMContentLoaded', () => {
    cambiarFondoAleatorio();

    if (btnRepartir) {
        btnRepartir.addEventListener('click', () => {
            // Si está en la portada, inicia el juego. Si ya está jugando, vuelve a la portada.
            if (document.body.classList.contains('game-idle')) {
                initGame();
            } else {
                volverAInicio();
            }
        });
    }

    if (btnPlayAgain) {
        btnPlayAgain.addEventListener('click', () => {
            if (victoryModal) victoryModal.classList.add('hidden');
            volverAInicio();
        });
    }
});

// --- VOLVER A LA PORTADA / MENÚ PRINCIPAL ---
function volverAInicio() {
    stopTimer();
    resetTimer();
    
    // Regresamos el estado CSS a la portada
    document.body.classList.add('game-idle');
    
    // Mostramos nuevamente el selector de modo y el botón en "Iniciar Juego"
    if (modeSelectorContainer) modeSelectorContainer.classList.remove('d-none');
    if (btnTextElement) btnTextElement.textContent = 'Iniciar Juego';
    
    // Limpiamos el tablero
    if (tablero) tablero.innerHTML = '';
}

// ==========================================
// MANEJO DEL SELECTOR DE MODO (DROPDOWN)
// ==========================================
const gameModeBtn = document.getElementById('gameModeBtn');
const gameModeMenu = document.querySelector('.glass-dropdown-menu');

if (gameModeBtn && gameModeMenu) {
  // 1. Abrir/Cerrar menú al hacer clic en el botón
  gameModeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    gameModeMenu.classList.toggle('show');
  });

  // 2. Selección de opción
  document.querySelectorAll('.glass-dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Cambiar clase activa
      document.querySelectorAll('.glass-dropdown-menu .dropdown-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Guardar modo y actualizar botón
      currentMode = item.getAttribute('data-value');
      gameModeBtn.textContent = item.textContent;

      // Mostrar u ocultar el reloj
      if (currentMode === 'cronometro') {
        if (timerContainer) timerContainer.classList.remove('d-none');
      } else {
        if (timerContainer) timerContainer.classList.add('d-none');
      }
      resetTimer();

      // Cerrar menú tras elegir
      gameModeMenu.classList.remove('show');
    });
  });

  // 3. Cerrar el menú si el usuario hace clic en cualquier otra parte de la pantalla
  document.addEventListener('click', () => {
    gameModeMenu.classList.remove('show');
  });
}

// ==========================================
// SISTEMA DE PUNTAJE Y RANKING (TOP 5)
// ==========================================
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const playerNameInput = document.getElementById('playerNameInput');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const leaderboardList = document.getElementById('leaderboardList');
const scoreSaveContainer = document.getElementById('scoreSaveContainer');

let currentScore = 0;

// Fórmula de Puntuación
function calcularPuntaje() {
    const basePoints = 1000;
    const penaltyMoves = moves * 15;
    const penaltyTime = (currentMode === 'cronometro') ? secondsElapsed * 5 : 0;
    
    currentScore = Math.max(0, basePoints - penaltyMoves - penaltyTime);
    
    if (finalScoreDisplay) {
        finalScoreDisplay.textContent = `${currentScore} pts`;
    }
}

// Obtener la clave de localStorage según el modo activo
function getRankingStorageKey() {
    return currentMode === 'cronometro' ? 'memoria_ranking_crono' : 'memoria_ranking_libre';
}

// Cargar y mostrar la lista desde localStorage
function actualizarLeaderboardUI() {
    if (!leaderboardList) return;
    
    const key = getRankingStorageKey();
    const ranking = JSON.parse(localStorage.getItem(key)) || [];
    leaderboardList.innerHTML = '';

    if (ranking.length === 0) {
        leaderboardList.innerHTML = '<li class="text-center text-muted py-2">Aún no hay récords en este modo</li>';
        return;
    }

    ranking.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-item';
        li.innerHTML = `
            <span><strong>#${idx + 1}</strong> ${item.nombre}</span>
            <span class="text-neon-green fw-bold">${item.puntos} pts</span>
        `;
        leaderboardList.appendChild(li);
    });
}

// Guardar récord al hacer clic en el botón
if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
        const nombre = (playerNameInput.value.trim() || 'ANON').toUpperCase();
        const key = getRankingStorageKey();
        let ranking = JSON.parse(localStorage.getItem(key)) || [];

        ranking.push({ nombre, puntos: currentScore });
        ranking.sort((a, b) => b.puntos - a.puntos);
        ranking = ranking.slice(0, 5); // Guardar solo Top 5

        localStorage.setItem(key, JSON.stringify(ranking));

        playerNameInput.value = '';
        if (scoreSaveContainer) scoreSaveContainer.classList.add('d-none');
        actualizarLeaderboardUI();
    });
}

// Validar input de iniciales (máximo 3 caracteres, solo letras)
if (playerNameInput) {
    playerNameInput.addEventListener('input', (e) => {
        // Convierte a mayúsculas y elimina cualquier carácter que no sea letra
        let valor = e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ]/g, '');
        // Corta estrictamente a 3 caracteres
        if (valor.length > 3) {
            valor = valor.slice(0, 3);
        }
        e.target.value = valor;
    });
}
// ==========================================
// MOSTRAR RANKING DESDE LA PORTADA
// ==========================================
const btnVerRanking = document.getElementById('btn-ver-ranking');

if (btnVerRanking) {
    btnVerRanking.addEventListener('click', () => {
        // Ocultar elementos exclusivos de la pantalla de victoria
        const iconModal = document.querySelector('.modal-content-custom img');
        const titleModal = document.querySelector('.modal-title-text');
        const scoreDisplayGroup = document.getElementById('finalScoreDisplay')?.parentElement;

        if (iconModal) iconModal.classList.add('d-none');
        if (titleModal) titleModal.classList.add('d-none');
        if (scoreDisplayGroup) scoreDisplayGroup.classList.add('d-none');
        if (scoreSaveContainer) scoreSaveContainer.classList.add('d-none');

        // Mostrar ranking
        const leaderboardContainer = document.querySelector('.leaderboard-container');
        if (leaderboardContainer) leaderboardContainer.classList.remove('d-none');

        // Título según el modo seleccionado
        const leaderboardTitle = document.querySelector('.leaderboard-container h6');
        if (leaderboardTitle) {
            leaderboardTitle.textContent = currentMode === 'cronometro' 
                ? '🏆 Top 5 Récords (Cronómetro)' 
                : '🏆 Top 5 Récords (Modo Libre)';
        }

        actualizarLeaderboardUI();

        // Cambiar texto del botón a "Cerrar"
        if (btnPlayAgain) btnPlayAgain.textContent = 'Cerrar';

        if (victoryModal) victoryModal.classList.remove('hidden');
    });
}