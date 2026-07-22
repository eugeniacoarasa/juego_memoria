// Elementos del DOM
const gridContainer = document.getElementById('grid-container');
const movesElement = document.getElementById('moves');
const matchesElement = document.getElementById('matches');
const restartBtn = document.getElementById('restart-btn');
const btnText = document.getElementById('btn-text');
const victoryModal = document.getElementById('victory-modal');
const playAgainBtn = document.getElementById('play-again-btn');

// --- EFECTOS DE SONIDO ---
const flipSound = new Audio('images/flip.mp3');
const matchSound = new Audio('images/match.mp3');
const failSound = new Audio('images/fail.mp3');
const shuffleSound = new Audio('images/shuffle.mp3');
const victorySound = new Audio('images/victory.mp3');

// Fotos de Clooney
const items = [
  'images/clooney1.JPG',
  'images/clooney2.JPG',
  'images/clooney3.JPG',
  'images/clooney4.JPG',
  'images/clooney5.JPG',
  'images/clooney6.jpg'
];

let cards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let lockBoard = false;

// Iniciar el juego
function initGame() {
  document.body.classList.remove('game-idle');

  victoryModal.classList.add('hidden');
  gridContainer.classList.remove('hidden-grid');

  gridContainer.innerHTML = '';
  moves = 0;
  matches = 0;
  flippedCards = [];
  lockBoard = true; 

  movesElement.textContent = moves;
  matchesElement.textContent = `${matches}/${items.length}`;

  if (btnText) btnText.textContent = 'Reiniciar';

  shuffleSound.currentTime = 0;
  shuffleSound.play().catch(() => {});

  cards = [...items, ...items];
  shuffle(cards);

  cards.forEach((imagePath, index) => {
    const col = document.createElement('div');
    col.classList.add('col');

    const card = document.createElement('div');
    card.classList.add('game-card', 'dealing');
    card.dataset.symbol = imagePath;

    const delay = index * 0.22; 
    card.style.animationDelay = `${delay}s`;

    card.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front" style="background-image: url('${imagePath}');"></div>
    `;

    card.addEventListener('click', flipCard);
    col.appendChild(card);
    gridContainer.appendChild(col);
  });

  setTimeout(() => {
    lockBoard = false;
    document.querySelectorAll('.game-card').forEach(c => c.classList.remove('dealing'));
  }, 4000);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

  flipSound.currentTime = 0;
  flipSound.play().catch(() => {});

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  lockBoard = true;
  moves++;
  movesElement.textContent = moves;

  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.symbol === card2.dataset.symbol;

  if (isMatch) {
    matchSound.currentTime = 0;
    matchSound.play().catch(() => {});

    setTimeout(() => {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matches++;
      matchesElement.textContent = `${matches}/${items.length}`;
      resetTurn();

      if (matches === items.length) {
        setTimeout(triggerVictory, 600);
      }
    }, 1000);

  } else {
    failSound.currentTime = 0;
    failSound.play().catch(() => {});

    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      resetTurn();
    }, 1800);
  }
}

function resetTurn() {
  flippedCards = [];
  lockBoard = false;
}

function triggerVictory() {
  gridContainer.classList.add('hidden-grid');
  victoryModal.classList.remove('hidden');

  victorySound.currentTime = 0;
  victorySound.play().catch(() => {});

  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);