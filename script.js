// ==========================================
// --- Lógica de la Ruleta ---
// ==========================================
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const modal = document.getElementById('result-modal');
const resultText = document.getElementById('result-text');
const closeModal = document.getElementById('close-modal');

const phrases = [
    "Te amo vida hermosa", // 0-60 grados
    "Bebita hermosa",      // 60-120
    "Te amo nene",         // 120-180
    "Mi nenita hermosa",   // 180-240
    "Te amo mami",         // 240-300
    "nenita hermosa" // 300-360
];

let currentRotation = 0;
let isSpinning = false;

// Evento para hacer girar la ruleta
spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;

    // Calcula giros extras (entre 5 y 10 vueltas) más un grado aleatorio
    const extraSpins = Math.floor(Math.random() * 5 + 5) * 360;
    const randomDegree = Math.floor(Math.random() * 360);
    
    currentRotation += extraSpins + randomDegree;
    
    // Aplica la rotación al CSS
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Espera 4 segundos (lo que dura la animación CSS) para mostrar el mensaje
    setTimeout(() => {
        const normalizedDegree = (360 - (currentRotation % 360)) % 360;
        const winningIndex = Math.floor(normalizedDegree / 60);
        
        resultText.innerText = phrases[winningIndex];
        modal.classList.remove('hidden');
        isSpinning = false;
    }, 4000); 
});

// Evento para cerrar el mensaje de la ruleta
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});


// ==========================================
// --- Lógica del Juego de Memoria (Fotos) ---
// ==========================================
const memoryGrid = document.getElementById('memory-grid');

// ¡AQUÍ VAN TUS FOTOS! 
// Cambia 'ruta/tu-foto1.jpg' por el nombre real de tus imágenes.
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