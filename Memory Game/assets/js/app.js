/* Game management */
const cards = document.querySelectorAll('.memory-card');
const flip = document.getElementById('flip');
const tiles = document.getElementById('tiles');
const time = document.getElementById('time');
const resultMove = document.getElementById('res-move');
const resultTime = document.getElementById('res-time');

/* Variables */
var tilesTotalPair = document.getElementById('difficulty').dataset.tiles;
var isBlock = false;
var firstCard = null;
var secondCard = null;
var totalFlips = 0;
var timeElapsed = 0; // Time
var gameStarted = false, gameEnded = false;
var tilesMatched = 0;
var click = 0; // START GAME button clicked
var paused = false;

/* Gameplay musics */
var bgMusic = new Audio('assets/audio/background-music.mp3');
var matchSound = new Audio('assets/audio/match.wav');
var flipSound = new Audio('assets/audio/flip.wav');
var victorySound = new Audio('assets/audio/victory.wav');

/* KEYBOARD Keys */
var R_key_disabled = false;
var P_key_disabled = false;
var Esc_key_disabled = false;


/* Update game statistics in LocalStorage */
function updateStatistics(status) {
    const difficulty = {
        6: 'easy',
        24: 'medium',
        54: 'hard'
    }

    var currentBestTime = localStorage.getItem(difficulty[tilesTotalPair] + ' best time');
    var matchedFlips = 2 * tilesMatched;
    var wrongFlips = totalFlips - (2 * tilesMatched);

    // Best time will be updated only if game is completed
    if (status == 'completed') {
        if (currentBestTime) {
            if (currentBestTime > timeElapsed)
                localStorage.setItem(difficulty[tilesTotalPair] + ' best time', timeElapsed);
        }
    
        else {
            localStorage.setItem(difficulty[tilesTotalPair] + ' best time', timeElapsed);
        }
    }
    
    localStorage.setItem(difficulty[tilesTotalPair] + ' match ' + status, 1 + Number(localStorage.getItem(difficulty[tilesTotalPair] + ' match ' + status)));
    localStorage.setItem(difficulty[tilesTotalPair] + ' match total', 1 + Number(localStorage.getItem(difficulty[tilesTotalPair] + ' match total')));

    // update number of flips
    localStorage.setItem(difficulty[tilesTotalPair] + ' total flips', totalFlips + Number(localStorage.getItem(difficulty[tilesTotalPair] + ' total flips')));
    localStorage.setItem(difficulty[tilesTotalPair] + ' matched flips', matchedFlips + Number(localStorage.getItem(difficulty[tilesTotalPair] + ' matched flips')));
    localStorage.setItem(difficulty[tilesTotalPair] + ' wrong flips', wrongFlips + Number(localStorage.getItem(difficulty[tilesTotalPair] + ' wrong flips')));
}


/* Background music. Played only while game is being played */
function backgroundMusicPlay() {
    bgMusic.play();
    bgMusic.volume = musicMuted ? 0 : 0.5;
    bgMusic.loop = true;
}


/* Sound when two cards matched */
function matchSoundPlay() {
    if (!soundMuted)
        matchSound.play();
}


/* Sound when a card is flipped */
function flipSoundPlay() {
    if (!soundMuted)
        flipSound.play();
}


/* Music when the game is over */
function victorySoundPlay() {
    bgMusic.pause();
    bgMusic.currentTime = 0;

    if (!soundMuted)
        victorySound.play();
}


/* Reset game display and unflip all cards when game starts */
function startGame() {
    backgroundMusicPlay();
    startTime();
}


/* Time when game started */
function startTime() {
    gameStarted = true;
}


/* Update time on game timer */
function updateTime() {
    if (!gameEnded) {
        timeElapsed++;
        time.innerHTML = timeElapsed;
    }
}


/* Shuffle cards randomly */
function shuffle() {
    cards.forEach(card => {
        var randomPosition = Math.floor(Math.random() * tilesTotalPair)
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
        startGame();

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


/* Reset cards (First card & Second Card) after a pair is drawn */
function resetBoard() {
    firstCard = null;
    secondCard = null;
    isBlock = false;
}


/* Reset time, score & shuffle cards when game is restarted again */
function resetGame() {
    bgMusic.pause();
    bgMusic.currentTime = 0;

    resetBoard();
    timeElapsed = 0;
    gameStarted = false;
    gameEnded = false;
    totalFlips = 0;
    click = 0;
    tilesMatched = 0;

    time.innerHTML = 0;
    tiles.innerHTML = tilesTotalPair * 2;
    flip.innerHTML = 0;

    document.getElementById('pop').style.visibility = 'hidden';
    document.querySelector('.restartPop').style.visibility = 'hidden';
    document.getElementById('game').classList.remove('blurred');
    cards.forEach(card => card.classList.remove('flip', 'matched'));
    cards.forEach(card => card.addEventListener('click', flipCard));
}


/* If a pair is matched, they can't be clicked again */
function disableCards() {
    tilesMatched++;
    tiles.innerHTML = (tilesTotalPair - tilesMatched) * 2;
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchSoundPlay();
    resetBoard();
    checkGameOver();
}


/* Check if all tiles are matched */
function checkGameOver() {
    if (tilesMatched == tilesTotalPair) {
        victorySoundPlay();
        gameEnded = true;
        result();
    }
}


/* Display result in a popup modal */
function result() {
    gameStarted = false;
    updateStatistics('completed');
    document.getElementById('pop').style.visibility = 'visible';
    document.getElementById('game').classList.add('blurred');
    resultMove.innerHTML = totalFlips;
    resultTime.innerHTML = timeElapsed;
}


/* Pause Game */
function pauseGame(event) {
    flipSoundPlay();
    disableBackground();
    paused = true;

    if (event == 'shuffle') {
        gameEnded = true;
        bgMusic.pause();

        // Disable other keyboard keys
        P_key_disabled = true;
        Esc_key_disabled = true;
    }

    else if (event == 'exit') {
        document.querySelector('.exit').style.visibility = 'visible';
        document.getElementById('game').classList.add('blurred');
        
        if (gameStarted)
            document.getElementById('warning').innerHTML = 'Your current game will be abandoned';
        else
            document.getElementById('warning').innerHTML = '';

        gameEnded = true;
        bgMusic.pause();

        // Disable other keyboard keys
        R_key_disabled = true;
        P_key_disabled = true;
    }

    else if (event == 'pause') {
        document.querySelector('.pauseScreen').style.visibility = 'visible';
        document.getElementById('game').classList.add('blurred');

        gameEnded = true;
        bgMusic.pause();

        // Disable other keyboard keys
        R_key_disabled = true;
        Esc_key_disabled = true;
    }
}


/* Resume Game */
function resumeGame() {
    flipSoundPlay();
    enableBackground();
    paused = false;
    document.querySelector('.pauseScreen').style.visibility = 'hidden';
    document.querySelector('.restartPop').style.visibility = 'hidden';
    document.querySelector('.exit').style.visibility = 'hidden';
    document.getElementById('game').classList.remove('blurred');
    gameEnded = false;

    if (gameStarted)
        bgMusic.play();

    // Enable all keyboard keys
    R_key_disabled = false;
    P_key_disabled = false;
    Esc_key_disabled = false;
}


/* Disable activies when game is paused */
function disableBackground() {
    document.body.style.pointerEvents = 'none';

    /* Popped screen should be clickable */
    document.querySelector('.restartPop').style.pointerEvents = 'auto';
    document.querySelector('.pauseScreen').style.pointerEvents = 'auto';
    document.querySelector('.exit').style.pointerEvents = 'auto';
}


/* Enable activities when game is resumed */
function enableBackground() {
    document.body.style.pointerEvents = 'auto';
}

/* Confirm return to home */
function returnToHome() {
    // Game abandoned if any game is running
    if (gameStarted)
        updateStatistics('abandoned');
}


/* Shiffle Board and Play Again */
function restartGame() {
    if (gameStarted)
        updateStatistics('abandoned');
    
    resumeGame(); // In case in-game SHUFFLE BOARD is clicked
    resetGame();

    // Shuffle card some times later so there are enough times for cards to be flipped back before shuffling
    setTimeout(() => {
        shuffle();
    }, 1000);
}


/* Game */
cards.forEach(card => card.addEventListener('click', flipCard));


/* Display EXIT GAME popup */
document.getElementById('home').addEventListener('click', function() {
    pauseGame('exit');
});


document.getElementsByTagName('button')[1].addEventListener('click', resumeGame);


// If a game is running, a popup will show. Otherwise the board will be simply shuffled.
document.querySelectorAll('.restart').forEach(btn => btn.addEventListener('click', function() {
    if (gameStarted) {
        pauseGame('shuffle');
        document.querySelector('.restartPop').style.visibility = 'visible';
        document.getElementById('game').classList.add('blurred');
    }

    else
        restartGame();

}));


/* Functionalities of keyboard keys */
/* [P] PAUSE GAME */
/* [R] RESTART GAME */
/* [Esc] Return to home popup */
$(document).ready(function() {
    $(document).on('keydown', function(e) {
        if (e.which == 80 && P_key_disabled == false) { // On pressing 'P'
            // Pause-Resume toggle
            paused == true ? resumeGame() : pauseGame('pause');
        }

        if (e.which == 82 && R_key_disabled == false) { // On pressing 'R'
            document.getElementById('shuffle').click();
        }

        if (e.key == 'Escape' && Esc_key_disabled == false) {
            paused == true ? resumeGame() : pauseGame('exit');
        }
    });
});


// Shuffle cards on window load
window.onload = () => {
    shuffle();
}

/* Update elapsed time per 0.1 seconds */
setInterval(() => {
    if (gameStarted) {
        updateTime();
    }
}, 1000);
