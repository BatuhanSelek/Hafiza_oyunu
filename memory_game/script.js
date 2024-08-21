const gameContainer = document.querySelector('.game-container');
const levelSelect = document.getElementById('level-select');
const timerElement = document.getElementById('time');
const scoreElement = document.getElementById('score-value');
const messageElement = document.getElementById('message');

let cards = [];
let cardValues = [];
let cardIds = [];
let matchedCards = [];
let numRows, numCols;

let score = 0;
let timeLeft = 60; // Initialize timeLeft globally

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

function initializeGame() {
    const level = parseInt(levelSelect.value);
    numRows = numCols = level;
    const totalCards = level * level;
    cards = generateCardArray(totalCards);
    createBoard();
    startTimer();
}

function startTimer() {
    timeLeft = 60; // Reset time left for new game
    timerElement.textContent = timeLeft;
    const timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Time is up! Game over.');
            // Optionally, you can reset the game or handle game over logic here
        }
    }, 1000);
}

function generateCardArray(numCards) {
    const cardValues = [];
    for (let i = 0; i < numCards / 2; i++) {
        cardValues.push(i, i); // Add each value twice
    }
    return cardValues.sort(() => 0.5 - Math.random()); // Shuffle cards
}

function createBoard() {
    gameContainer.innerHTML = ''; // Clear existing cards
    gameContainer.style.gridTemplateColumns = `repeat(${numCols}, 100px)`;
    gameContainer.style.gridTemplateRows = `repeat(${numRows}, 100px)`;

    for (let i = 0; i < cards.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', i);
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    }
}

function flipCard() {
    const selected = this;
    const cardId = selected.getAttribute('data-id');
    selected.textContent = cards[cardId];
    selected.classList.add('flipped');
    cardValues.push(cards[cardId]);
    cardIds.push(cardId);

    if (cardValues.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const cardElements = document.querySelectorAll('.card');
    const [firstId, secondId] = cardIds;

    if (cardValues[0] === cardValues[1] && firstId !== secondId) {
        cardElements[firstId].classList.add('matched');
        cardElements[secondId].classList.add('matched');
        matchedCards.push(cardValues);
        updateScore(10); // Add points for a match
    } else {
        cardElements[firstId].textContent = '';
        cardElements[secondId].textContent = '';
        cardElements[firstId].classList.remove('flipped');
        cardElements[secondId].classList.remove('flipped');
    }

    cardValues = [];
    cardIds = [];

    if (matchedCards.length === cards.length / 2) {
        messageElement.classList.add('show');
        // Uncomment if you have a winSound element
        // winSound.play(); // Play win sound
        setTimeout(() => messageElement.classList.remove('show'), 3000);
    }
}

levelSelect.addEventListener('change', initializeGame);

// Initialize the game on page load
initializeGame();
