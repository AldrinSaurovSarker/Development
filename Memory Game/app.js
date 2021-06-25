const cards = document.querySelectorAll('.memory-card');
const flip = document.getElementById('flip');
const time = document.getElementById('time');
const resultMove = document.getElementById('res-move');
const resultTime = document.getElementById('res-time');

/* Variables */
const numberOfCards = 12;
var isBlock = false;
var firstCard = null;
var secondCard = null;
var totalFlips = 0;
var start = 0, end = 0, timeElapsed = 0; // Time
var gameStarted = false, gameEnded = false;
var tilesMatched = 0;
var click = 0; // START GAME button clicked

/* Gameplay musics */
var bgMusic = new Audio('audio/background-music.mp3');
var matchSound = new Audio('audio/match.wav');
var flipSound = new Audio('audio/flip.wav');
var victorySound = new Audio('audio/victory.wav');


/* Background music. Played only while game is being played */
function backgroundMusicPlay() {
    bgMusic.play();
    bgMusic.volume = 0.5;
    bgMusic.loop = true;
}


/* Sound when two cards matched */
function matchSoundPlay() {
    matchSound.play();
}


/* Sound when a card is flipped */
function flipSoundPlay() {
    flipSound.play();
}


/* Music when the game is over */
function victorySoundPlay() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    victorySound.play();
}


/* Reset game display and unflip all cards when game starts */
function startGame() {
    time.innerHTML = 0;
    flip.innerHTML = 0;
    cards.forEach(card => card.classList.remove('flip'));
    backgroundMusicPlay();
    startTime();
}


/* Time when game started */
function startTime() {
    gameStarted = true;
    start = new Date();
}


/* Calculate elapsed time since the game started */
function endTime() {
    end = new Date();
    timeElapsed = Math.round((end - start)/1000);
    time.innerHTML = timeElapsed;
}


/* Update time on game timer */
function updateTime() {
    if (!gameEnded)
        setTimeout(endTime, 1000);
}


/* Shuffle cards randomly */
function shuffle() {
    cards.forEach(card => {
        var randomPosition = Math.floor(Math.random() * numberOfCards)
        card.style.order = randomPosition;
    });
}


/* Gameplay */
function flipCard() {
    if (isBlock) /* Return if card is clicked even before last unmatched pair of cards are unflipped */
        return;

    if (this === firstCard) /* Return if the already flipped (unmatched) card is clicked again as the second card */
        return;

    if (!gameStarted) /* Return if game is not started but card is clicked */
        return;

    this.classList.add('flip'); /* Flip the card */
    flipSoundPlay();
    totalFlips += 1;
    flip.innerHTML = totalFlips;

    /* If this card is the only unmatched flipped card, return */
    if (firstCard == null) {
        firstCard = this;
    }

    /* Check for match if two unmatched cards are flipped */
    else {
        secondCard = this;
        checkForMatch();
    }
}


/* Check if a pair of card matches or not */
function checkForMatch() {
    firstCard.dataset.image === secondCard.dataset.image ? disableCards() : unflipCard();
}


/* If a pair of cards don't match, unfilp them after one second */
function unflipCard() {
    isBlock = true;

    setTimeout(function() {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}


function resetBoard() {
    firstCard = null;
    secondCard = null;
    isBlock = false;
}


/* Reset time, score & shuffle cards when game is restarted again */
function resetGame() {
    gameStarted = false;
    gameEnded = false;
    totalFlips = 0;
    click = 0;
    tilesMatched = 0;
    cards.forEach(card => card.addEventListener('click', flipCard));
}


/* If a pair is matched, they can't be clicked again */
function disableCards() {
    matchSoundPlay();
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    tilesMatched++;
    resetBoard();
    checkGameOver();
}


/* Check if all tiles are matched */
function checkGameOver() {
    if (tilesMatched == 6) {
        victorySoundPlay();
        gameEnded = true;
        result();
    }
}


/* Display result in a popup modal for 5 seconds */
function result() {
    document.getElementById('pop').style.visibility = 'visible';
    document.getElementById('game').classList.add('blurred');
    resultMove.innerHTML = totalFlips;
    resultTime.innerHTML = timeElapsed;
    resetGame();

    setTimeout(() => {
        document.getElementById('pop').style.visibility = 'hidden';
        document.getElementById('game').classList.remove('blurred');
    }, 5000);
}


/* Game starts only when 'START GAME' pressed while game in NOT RUNNING. */
(function(){
    'use-strict';

    var button = document.getElementsByTagName('button')[0];
    var myHandler = function() {
        return function() {
            if (click === 0) {
                shuffle();
                startGame();
            }
            click++;
        }
    }();
    
    button.addEventListener('click', myHandler, false);
})();


cards.forEach(card => card.addEventListener('click', flipCard));


/* Update elapsed time per 0.1 seconds */
setInterval(() => {
    if (gameStarted) {
        updateTime();
    }
}, 100);
