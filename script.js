// ==========================================
// --- Lógica de la Ruleta ---
// ==========================================
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const modal = document.getElementById('result-modal');
const resultText = document.getElementById('result-text');
const closeModal = document.getElementById('close-modal');

const phrases = [
    "Te amo vida hermosa", 
    "Bebita hermosa",      
    "Te amo nene",         
    "Mi nenita hermosa",  
    "Te amo mami",       
    "nenita hermosa" 
];

let currentRotation = 0;
let isSpinning = false;

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;

    const extraSpins = Math.floor(Math.random() * 5 + 5) * 360;
    const randomDegree = Math.floor(Math.random() * 360);
    
    currentRotation += extraSpins + randomDegree;
    
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const normalizedDegree = (360 - (currentRotation % 360)) % 360;
        const winningIndex = Math.floor(normalizedDegree / 60);
        
        resultText.innerText = phrases[winningIndex];
        modal.classList.remove('hidden');
        isSpinning = false;
    }, 4000); 
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});


// ==========================================
// --- Lógica del Juego de Memoria (Fotos) ---
// ==========================================
const memoryGrid = document.getElementById('memory-grid');


const cardImages = [
    'imagenes/1.jpg',
    'imagenes/2.jpg',
    'imagenes/3.jpg',
    'imagenes/4.jpg',
    'imagenes/5.jpg',
    'imagenes/6.jpg'
];

let cardsArray = [...cardImages, ...cardImages];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    cardsArray = shuffle(cardsArray);
    cardsArray.forEach(imagePath => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.image = imagePath; 

        cardElement.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back" style="background-image: url('${imagePath}');"></div>
        `;
        
        cardElement.addEventListener('click', flipCard);
        memoryGrid.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

createBoard();
