// ==========================================
// 1. EFECTOS DE SONIDO Y AUDIO
// ==========================================
const flipSound = new Audio('images/flip.mp3');
const matchSound = new Audio('images/match.mp3');
const failSound = new Audio('images/fail.mp3');
const shuffleSound = new Audio('images/shuffle.mp3');
const victorySound = new Audio('images/victory.mp3');

let isMuted = false;

const btnAudio = document.getElementById('btn-audio');
const audioIcon = document.getElementById('audio-icon');

if (btnAudio) {
  btnAudio.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      if (audioIcon) audioIcon.textContent = '🔇';
      btnAudio.classList.add('muted');
    } else {
      if (audioIcon) audioIcon.textContent = '🔊';
      btnAudio.classList.remove('muted');
    }
  });
}

function reproducirSonido(audio) {
  if (!isMuted && audio) {
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio play blocked/error:", err));
  }
}

// ==========================================
// 2. CELEBRACIÓN DE VICTORIA: PURPURINA DUAL
// ==========================================
let continuousConfettiInterval = null;
let fgCanvas = null;
let bgCanvas = null;

function startVictoryConfetti() {
  stopVictoryConfetti();

  if (typeof confetti !== 'function') return;

  // 1. CAPA FRONTAL (99999): Explosión inicial gigante por delante
  fgCanvas = document.createElement('canvas');
  fgCanvas.style.position = 'fixed';
  fgCanvas.style.top = '0';
  fgCanvas.style.left = '0';
  fgCanvas.style.width = '100vw';
  fgCanvas.style.height = '100vh';
  fgCanvas.style.pointerEvents = 'none';
  fgCanvas.style.zIndex = '99999';
  document.body.appendChild(fgCanvas);

  const fgConfetti = confetti.create(fgCanvas, { resize: true, useWorker: true });

  fgConfetti({
    particleCount: 140,
    spread: 120,
    origin: { y: 0.55 },
    colors: ['#00ff87', '#a7f3d0', '#ffd700', '#ff007f', '#ffffff', '#60efff'],
    ticks: 220,
    gravity: 0.8,
    scalar: 1.15
  });

  setTimeout(() => {
    if (fgCanvas && fgCanvas.parentNode) {
      fgCanvas.parentNode.removeChild(fgCanvas);
      fgCanvas = null;
    }
  }, 3000);

  // 2. CAPA TRASERA (501): Lluvia continua por DETRÁS de la caja del modal (502) pero SOBRE la cortina oscura (500)
  bgCanvas = document.createElement('canvas');
  bgCanvas.style.position = 'fixed';
  bgCanvas.style.top = '0';
  bgCanvas.style.left = '0';
  bgCanvas.style.width = '100vw';
  bgCanvas.style.height = '100vh';
  bgCanvas.style.pointerEvents = 'none';
  bgCanvas.style.zIndex = '501'; 
  document.body.appendChild(bgCanvas);

  const bgConfetti = confetti.create(bgCanvas, { resize: true, useWorker: true });

  continuousConfettiInterval = setInterval(() => {
    bgConfetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.75 },
      colors: ['#00ff87', '#ffd700', '#60efff', '#ff007f']
    });
    bgConfetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.75 },
      colors: ['#00ff87', '#ffd700', '#60efff', '#ff007f']
    });
  }, 380);
}

function stopVictoryConfetti() {
  if (continuousConfettiInterval) {
    clearInterval(continuousConfettiInterval);
    continuousConfettiInterval = null;
  }
  if (fgCanvas && fgCanvas.parentNode) {
    fgCanvas.parentNode.removeChild(fgCanvas);
    fgCanvas = null;
  }
  if (bgCanvas && bgCanvas.parentNode) {
    bgCanvas.parentNode.removeChild(bgCanvas);
    bgCanvas = null;
  }
}

// ==========================================
// 3. VARIABLES DE ESTADO Y ELEMENTOS DOM
// ==========================================
let flippedCards = [];
let moves = 0;
let matches = 0;
let lockBoard = false;

let timerInterval = null;
let secondsElapsed = 0;
let currentMode = 'libre';

let currentPairs = 6;
let hintUsed = false;

// Referencias al DOM
const tablero = document.getElementById('grid-container');
const movesElement = document.getElementById('moves');
const matchesElement = document.getElementById('matches');
const btnRepartir = document.getElementById('restart-btn');
const btnTextElement = document.getElementById('btn-text');
const victoryModal = document.getElementById('victory-modal');
const btnPlayAgain = document.getElementById('play-again-btn');

const timerContainer = document.getElementById('timerContainer');
const timerDisplay = document.getElementById('timerDisplay');
const modeSelectorContainer = document.getElementById('modeSelectorContainer');
const difficultySelect = document.getElementById('difficultySelect');
const gameModeSelect = document.getElementById('gameModeSelect');
const btnHint = document.getElementById('btn-hint');

// ==========================================
// 4. LÓGICA DEL CRONÓMETRO
// ==========================================
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
  if (timerDisplay) timerDisplay.textContent = mins + ':' + secs;
}

// ==========================================
// 5. GENERACIÓN DE IMÁGENES Y FONDO
// ==========================================
function cambiarFondoAleatorio() {
    const randomBgSeed = Math.floor(Math.random() * 5000);
    const bgUrl = 'https://picsum.photos/seed/bg_' + randomBgSeed + '/1920/1080';
    document.body.style.backgroundImage = 'url("' + bgUrl + '")';
}

function obtenerNuevasImagenes() {
    const randomSeed = Math.floor(Math.random() * 10000);
    const imagenes = [];
    for (let i = 1; i <= currentPairs; i++) {
        imagenes.push('https://picsum.photos/seed/' + randomSeed + '_foto' + i + '/300/400');
    }
    return imagenes;
}

// ==========================================
// 6. INICIAR / REINICIAR EL JUEGO
// ==========================================
function initGame() {
    stopVictoryConfetti();
    document.body.classList.remove('game-idle');
    
    if (modeSelectorContainer) {
        modeSelectorContainer.classList.add('d-none');
    }

    hintUsed = false;
    if (btnHint) {
      btnHint.disabled = false;
      btnHint.classList.remove('used', 'd-none');
      btnHint.textContent = '👁️ Pista (1x)';
    }

    if (currentMode === 'cronometro') {
        if (timerContainer) timerContainer.classList.remove('d-none');
        startTimer();
    } else {
        if (timerContainer) timerContainer.classList.add('d-none');
        resetTimer();
    }

    if (btnTextElement) {
        btnTextElement.textContent = 'Reiniciar';
    }

    cambiarFondoAleatorio();
    
    if (victoryModal) {
        victoryModal.classList.add('hidden');
    }

    reproducirSonido(shuffleSound);

    moves = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;

    if (movesElement) movesElement.textContent = '0';
    if (matchesElement) matchesElement.textContent = '0/' + currentPairs;

    const imagenesBase = obtenerNuevasImagenes();
    let mazo = [...imagenesBase, ...imagenesBase];
    mazo.sort(() => Math.random() - 0.5);

    renderizarTablero(mazo);
}

// ==========================================
// 7. DIBUJAR TABLERO Y CARTAS
// ==========================================
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

// ==========================================
// 8. LÓGICA DE JUEGO (VOLTEAR Y COMPROBAR)
// ==========================================
function voltearCarta(card) {
    if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    reproducirSonido(flipSound);

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        comprobarPareja();
    }
}

function comprobarPareja() {
    moves++;
    if (movesElement) movesElement.textContent = moves;

    const [carta1, carta2] = flippedCards;
    const esIgual = carta1.dataset.image === carta2.dataset.image;

    if (esIgual) {
        reproducirSonido(matchSound);

        carta1.classList.add('matched');
        carta2.classList.add('matched');
        matches++;

        if (matchesElement) matchesElement.textContent = matches + '/' + currentPairs;
        flippedCards = [];

        if (matches === currentPairs) {
            stopTimer();
            setTimeout(() => {
                reproducirSonido(victorySound);
                
                startVictoryConfetti();

                const iconModal = document.querySelector('.modal-content-custom img');
                const titleModal = document.querySelector('.modal-title-text');
                const scoreDisplayGroup = document.getElementById('finalScoreDisplay')?.parentElement;
                const leaderboardContainer = document.querySelector('.leaderboard-container');

                if (iconModal) iconModal.classList.remove('d-none');
                if (titleModal) titleModal.classList.remove('d-none');
                if (btnPlayAgain) btnPlayAgain.textContent = '¿Jugar de nuevo?';

                calcularPuntaje();
                if (scoreDisplayGroup) scoreDisplayGroup.classList.remove('d-none');
                if (scoreSaveContainer) scoreSaveContainer.classList.remove('d-none');
                if (leaderboardContainer) leaderboardContainer.classList.remove('d-none');

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
            reproducirSonido(failSound);

            carta1.classList.remove('flipped');
            carta2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 900);
    }
}

function volverAInicio() {
    stopVictoryConfetti();
    stopTimer();
    resetTimer();
    
    document.body.classList.add('game-idle');
    
    if (modeSelectorContainer) modeSelectorContainer.classList.remove('d-none');
    if (btnTextElement) btnTextElement.textContent = 'Iniciar Juego';
    if (btnHint) btnHint.classList.add('d-none');
    
    if (tablero) tablero.innerHTML = '';
}

// ==========================================
// 9. DIFICULTAD ADAPTATIVA SEGÚN PANTALLA
// ==========================================
function actualizarOpcionesDificultad() {
  const width = window.innerWidth;
  const select = document.getElementById('difficultySelect');
  if (!select) return;

  const valorPrevio = select.value;
  select.innerHTML = '';

  let opciones = [];

  if (width < 576) {
    opciones = [
      { value: 'easy', text: '🌱 Fácil (8)', pairs: 4 },
      { value: 'normal', text: '⚡ Normal (12)', pairs: 6 }
    ];
  } else if (width < 1200) {
    opciones = [
      { value: 'easy', text: '🌱 Fácil (8)', pairs: 4 },
      { value: 'normal', text: '⚡ Normal (12)', pairs: 6 },
      { value: 'hard', text: '🔥 Difícil (16)', pairs: 8 },
      { value: 'extreme', text: '💥 Extremo (18)', pairs: 9 }
    ];
  } else {
    opciones = [
      { value: 'easy', text: '🌱 Fácil (8)', pairs: 4 },
      { value: 'normal', text: '⚡ Normal (12)', pairs: 6 },
      { value: 'hard', text: '🔥 Difícil (16)', pairs: 8 },
      { value: 'expert', text: '🚀 Experto (20)', pairs: 10 },
      { value: 'legend', text: '👑 Leyenda (24)', pairs: 12 }
    ];
  }

  opciones.forEach(op => {
    const opt = document.createElement('option');
    opt.value = op.value;
    opt.textContent = op.text;
    opt.dataset.pairs = op.pairs;
    select.appendChild(opt);
  });

  if (opciones.some(o => o.value === valorPrevio)) {
    select.value = valorPrevio;
  } else {
    select.value = 'normal';
  }

  actualizarParejasDesdeSelect();
}

function actualizarParejasDesdeSelect() {
  const select = document.getElementById('difficultySelect');
  if (!select) return;
  const selectedOpt = select.options[select.selectedIndex];
  if (selectedOpt && selectedOpt.dataset.pairs) {
    currentPairs = parseInt(selectedOpt.dataset.pairs, 10);
  }
}

// ==========================================
// 10. EVENTOS DE SELECTORES Y CONTROLES
// ==========================================
if (gameModeSelect) {
  gameModeSelect.addEventListener('change', (e) => {
    currentMode = e.target.value;

    if (currentMode === 'cronometro') {
      if (timerContainer) timerContainer.classList.remove('d-none');
    } else {
      if (timerContainer) timerContainer.classList.add('d-none');
    }
    resetTimer();
  });
}

const diffSelectEl = document.getElementById('difficultySelect');
if (diffSelectEl) {
  diffSelectEl.addEventListener('change', actualizarParejasDesdeSelect);
}

window.addEventListener('resize', () => {
  if (document.body.classList.contains('game-idle')) {
    actualizarOpcionesDificultad();
  }
});

// ==========================================
// 11. COMODÍN DE PISTA
// ==========================================
if (btnHint) {
  btnHint.addEventListener('click', () => {
    if (hintUsed || lockBoard || document.body.classList.contains('game-idle')) return;

    hintUsed = true;
    btnHint.disabled = true;
    btnHint.classList.add('used');
    btnHint.textContent = '👁️ Pista Usada';

    lockBoard = true;
    const unrevealedCards = document.querySelectorAll('.game-card:not(.matched):not(.flipped)');

    unrevealedCards.forEach(card => card.classList.add('flipped'));
    reproducirSonido(flipSound);

    setTimeout(() => {
      unrevealedCards.forEach(card => card.classList.remove('flipped'));
      lockBoard = false;
    }, 1500);
  });
}

// ==========================================
// 12. PUNTAJE Y RANKING (LOCALSTORAGE)
// ==========================================
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const playerNameInput = document.getElementById('playerNameInput');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const leaderboardList = document.getElementById('leaderboardList');
const scoreSaveContainer = document.getElementById('scoreSaveContainer');

let currentScore = 0;

function calcularPuntaje() {
    const basePoints = currentPairs * 200;
    const penaltyMoves = moves * 15;
    const penaltyTime = (currentMode === 'cronometro') ? secondsElapsed * 5 : 0;
    const penaltyHint = hintUsed ? 150 : 0;
    
    currentScore = Math.max(0, basePoints - penaltyMoves - penaltyTime - penaltyHint);
    
    if (finalScoreDisplay) {
        finalScoreDisplay.textContent = currentScore + ' pts';
    }
}

function getRankingStorageKey() {
    return currentMode === 'cronometro' ? 'memoria_ranking_crono' : 'memoria_ranking_libre';
}

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

if (saveScoreBtn) {
    saveScoreBtn.addEventListener('click', () => {
        const nombre = (playerNameInput.value.trim() || 'ANON').toUpperCase();
        const key = getRankingStorageKey();
        let ranking = JSON.parse(localStorage.getItem(key)) || [];

        ranking.push({ nombre, puntos: currentScore });
        ranking.sort((a, b) => b.puntos - a.puntos);
        ranking = ranking.slice(0, 5);

        localStorage.setItem(key, JSON.stringify(ranking));

        playerNameInput.value = '';
        if (scoreSaveContainer) scoreSaveContainer.classList.add('d-none');
        actualizarLeaderboardUI();
    });
}

if (playerNameInput) {
    playerNameInput.addEventListener('input', (e) => {
        let valor = e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ]/g, '');
        if (valor.length > 3) valor = valor.slice(0, 3);
        e.target.value = valor;
    });
}

const btnVerRanking = document.getElementById('btn-ver-ranking');
if (btnVerRanking) {
    btnVerRanking.addEventListener('click', () => {
        const iconModal = document.querySelector('.modal-content-custom img');
        const titleModal = document.querySelector('.modal-title-text');
        const scoreDisplayGroup = document.getElementById('finalScoreDisplay')?.parentElement;

        if (iconModal) iconModal.classList.add('d-none');
        if (titleModal) titleModal.classList.add('d-none');
        if (scoreDisplayGroup) scoreDisplayGroup.classList.add('d-none');
        if (scoreSaveContainer) scoreSaveContainer.classList.add('d-none');

        const leaderboardContainer = document.querySelector('.leaderboard-container');
        if (leaderboardContainer) leaderboardContainer.classList.remove('d-none');

        const leaderboardTitle = document.querySelector('.leaderboard-container h6');
        if (leaderboardTitle) {
            leaderboardTitle.textContent = currentMode === 'cronometro' 
                ? '🏆 Top 5 Récords (Cronómetro)' 
                : '🏆 Top 5 Récords (Modo Libre)';
        }

        actualizarLeaderboardUI();
        if (btnPlayAgain) btnPlayAgain.textContent = 'Cerrar';
        if (victoryModal) victoryModal.classList.remove('hidden');
    });
}

// ==========================================
// 13. PANTALLA COMPLETA
// ==========================================
const btnFullscreen = document.getElementById('btn-fullscreen');
if (btnFullscreen) {
  btnFullscreen.addEventListener('click', () => {
    const fsIcon = btnFullscreen.querySelector('.fs-icon');
    const fsText = btnFullscreen.querySelector('.fs-text');

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        if (fsIcon) fsIcon.textContent = '✕';
        if (fsText) fsText.textContent = ' Salir';
      }).catch(err => console.log('Fullscreen error:', err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          if (fsIcon) fsIcon.textContent = '⛶';
          if (fsText) fsText.textContent = ' Pantalla Completa';
        });
      }
    }
  });
}

// ==========================================
// 14. ANIMACIÓN DEL TÍTULO EN PORTADA (IMG1 A IMG6)
// ==========================================
const letterImages = [
  'images/img1.jpg',
  'images/img2.jpg',
  'images/img3.jpg',
  'images/img4.jpg',
  'images/img5.jpg',
  'images/img6.jpg'
];

function initAnimatedTitle() {
  const words = document.querySelectorAll('.title-word');
  if (!words.length) return;

  words.forEach(wordEl => {
    const text = wordEl.textContent;
    wordEl.innerHTML = '';
    [...text].forEach(char => {
      const span = document.createElement('span');
      span.className = 'letter-animated';
      span.textContent = char === ' ' ? '\u00A0' : char;
      wordEl.appendChild(span);
    });
  });

  const isMobile = window.innerWidth < 768;
  const intervalTime = isMobile ? 3000 : 1800; 

  setInterval(flipRandomLetter, intervalTime);
}

function flipRandomLetter() {
  // SOLO VOLTEAR LETRAS SI ESTAMOS EN LA PORTADA
  if (!document.body.classList.contains('game-idle')) return;

  const letters = document.querySelectorAll('.letter-animated');
  if (!letters.length) return;

  const validLetters = Array.from(letters).filter(l => l.textContent.trim() !== '');
  const randomSpan = validLetters[Math.floor(Math.random() * validLetters.length)];

  const randomImg = letterImages[Math.floor(Math.random() * letterImages.length)];

  randomSpan.style.backgroundImage = `url('${randomImg}')`;
  randomSpan.classList.add('flipping');

  setTimeout(() => {
    randomSpan.classList.remove('flipping');
    randomSpan.style.backgroundImage = 'none';
  }, 850);
}

// ==========================================
// 15. INICIAR AL CARGAR EL DOCUMENTO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    actualizarOpcionesDificultad();
    cambiarFondoAleatorio();
    initAnimatedTitle();

    if (btnRepartir) {
        btnRepartir.addEventListener('click', () => {
            if (document.body.classList.contains('game-idle')) {
                initGame();
            } else {
                volverAInicio();
            }
        });
    }

    if (btnPlayAgain) {
        btnPlayAgain.addEventListener('click', () => {
            stopVictoryConfetti();
            if (victoryModal) victoryModal.classList.add('hidden');
            volverAInicio();
        });
    }
});