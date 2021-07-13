import { countRevealedTiles, setTimer, setGameOver, resetFlags, gameover, drawBoard,
    setBtnProperties, flagAllSquares, unflagAllSquares } from "./game.js";
import { squares, run, game_over, game_started } from "./game.js";
import { resultBox, content } from "./game.js";
export var NUMBER_OF_BOMBS = 10;
export var ROW = 9, COL = 9; //30 Col max
export var timeElapsed = 0;
export var digitColors =  ['blue', 'green', 'red', 'purple', 'black', 'gray', 'maroon', 'turquoise'];
export var bombType = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M23,13V11H19.93C19.75,9.58 19.19,8.23 18.31,7.1L20.5,4.93L19.07,3.5L16.9,5.69C15.77,4.81 14.42,4.25 13,4.07V1H11V4.07C9.58,4.25 8.23,4.81 7.1,5.69L4.93,3.5L3.5,4.93L5.69,7.1C4.81,8.23 4.25,9.58 4.07,11H1V13H4.07C4.25,14.42 4.81,15.77 5.69,16.9L3.5,19.07L4.93,20.5L7.1,18.31C8.23,19.19 9.58,19.75 11,19.93V23H13V19.93C14.42,19.75 15.77,19.19 16.9,18.31L19.07,20.5L20.5,19.07L18.31,16.9C19.19,15.77 19.75,14.42 19.93,13H23M12,8A4,4 0 0,0 8,12H6A6,6 0 0,1 12,6V8Z" /></svg>';
export var diff = 'beginner';

const timer = document.querySelector('.timer');
const gridForm = document.querySelector('.change-grid-form');
const pauseScreen = document.querySelector('.pause-screen');
const cancelBtn = document.querySelectorAll('.cancel');
const restartLevel = document.querySelectorAll('.restart');
const gridBtn = document.querySelectorAll('.change-grid-btn');
const shuffleBoardBtn = document.querySelectorAll('.shuffle');

var revealedTiles;


// Set theme
function setTheme(themeList) {
    var theme = themeList.options[themeList.selectedIndex].value;
    document.body.className = theme;
    setThemeProperties();
}

// Different color for different digits on the game board
function setThemeProperties() {
    if (document.body.classList.contains('theme-light')) {
        digitColors =  ['blue', 'green', 'red', 'purple', 'black', 'gray', 'maroon', 'turquoise'];
        bombType = '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M23,13V11H19.93C19.75,9.58 19.19,8.23 18.31,7.1L20.5,4.93L19.07,3.5L16.9,5.69C15.77,4.81 14.42,4.25 13,4.07V1H11V4.07C9.58,4.25 8.23,4.81 7.1,5.69L4.93,3.5L3.5,4.93L5.69,7.1C4.81,8.23 4.25,9.58 4.07,11H1V13H4.07C4.25,14.42 4.81,15.77 5.69,16.9L3.5,19.07L4.93,20.5L7.1,18.31C8.23,19.19 9.58,19.75 11,19.93V23H13V19.93C14.42,19.75 15.77,19.19 16.9,18.31L19.07,20.5L20.5,19.07L18.31,16.9C19.19,15.77 19.75,14.42 19.93,13H23M12,8A4,4 0 0,0 8,12H6A6,6 0 0,1 12,6V8Z" /></svg>';
    }

    else if (document.body.classList.contains('theme-dark')) {
        digitColors =  ['cyan', 'lime', '#fe4747', '#ff38ca', 'black', 'yellow', '#c51717', 'turquoise'];
        bombType = '<i class="fas fa-bomb"></i>';
    }

    else if (document.body.classList.contains('theme-nature')) {
        digitColors =  ['cyan', 'lime', 'red', '#ff38ca', 'white', 'yellow', '#c51717', 'royalblue'];
        bombType = '<i class="las la-radiation" style="color: yellow"></i>';
    }

    else if (document.body.classList.contains('theme-fire')) {
        digitColors =  ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange'];
        bombType = '<i class="fas fa-fire-alt"></i>';
    }

    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            var box = squares[i][j]; 
            if (box.number > 0 && box.status == 'clicked') {
                box.draw.style.color = digitColors[box.number-1];
            }
        }
    }
}


// Set the number of rows, colunms and bombs for different difficulty level
function setBoardSize(difficulty) {
    // Properties for built-in difficulties
    const properties =  {
        'beginner': [9, 9, 10],
        'intermediate': [16, 16, 40],
        'expert': [16, 30, 99]
    }

    // Setiings for custom difficulty
    if (difficulty == 'custom') {
        var x = document.getElementById("customForm");
        
        ROW = x.elements[0].value;
        COL = x.elements[1].value;
        NUMBER_OF_BOMBS = x.elements[2].value;
        diff = 'custom';

        // Adjusting invalid inputs
        if (ROW < 1) {
            ROW = 1;
            x.elements[0].value = ROW;
        }
            
        if (COL < 1) {
            COL = 1;
            x.elements[1].value = COL;
        }

        if (NUMBER_OF_BOMBS > ROW * COL) {
            NUMBER_OF_BOMBS = Math.floor((ROW * COL)/2);
            x.elements[2].value = NUMBER_OF_BOMBS;
        }
    }

    else {
        ROW = properties[difficulty][0];
        COL = properties[difficulty][1];
        NUMBER_OF_BOMBS = properties[difficulty][2];
        diff = difficulty;
    }
    
    content.classList.remove('blurred');
    gridForm.classList.remove('fadeAnimation');
    gridForm.style.visibility = 'hidden';

    shuffleBoard();
}


// Change the position of bombs and reset all properties except ROW, COL & NUMBER_OF_BOMBS
function shuffleBoard() {
    drawBoard();
    restartCurrentLevel();
    setBtnProperties();
    setTimer(false);
}


// Restart any level (all bombs and numbers are at the same position like a level currently is being played)
function restartCurrentLevel() {
    timeElapsed = 0;
    setTimer(true);
    setGameOver(false);
    resetFlags();
    unflagAllSquares();

    resultBox.style.display = 'none';
    content.classList.remove('blurred');

    // Make all tiles clickable and numbers are hidden
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            squares[i][j].status = 'clickable';
            squares[i][j].draw.innerHTML = '';
            squares[i][j].draw.classList.remove('revealed', 'bombed');
            squares[i][j].draw.style.color = '#000000';
        }
    }
}


// Pause Game
function pauseGame() {
    setTimer(false);
    content.classList.add('blurred');
    pauseScreen.style.visibility = 'visible';
}


// Resume Game
function resumeGame() {
    if (game_started)
        setTimer(true);

    content.classList.remove('blurred');
    pauseScreen.style.visibility = 'hidden';
}


// Show the popup of 'Change Grid Size'
function adjustGrid() {
    setTimer(false);

    // Hide the game contents
    if (!content.classList.contains('blurred'))
        content.classList.add('blurred');

    gridForm.style.visibility = 'visible';
    gridForm.classList.add('fadeAnimation');
}


// Hide the popup of 'Change Grid Size'
function cancelGridChange() {
    // Show the game content is game is not over
    if (!game_over) {
        // Timer will be started if game was started before the popup showing
        if (game_started)
            setTimer(true);

        content.classList.remove('blurred');
    }

    gridForm.classList.remove('fadeAnimation');
    gridForm.style.visibility = 'hidden';
}


// Check if all numbers are revealed
function checkForGameWin() {
    if (ROW * COL - revealedTiles == NUMBER_OF_BOMBS) {
        flagAllSquares();
        setTimer(false);
        gameover('win');
    }
}


// Disable clicks while gameover/victory music is being played
export function disableClicks() {
    document.body.style.pointerEvents = 'none';
}


// Active clicks after gameover/victory music is being played
export function activeClicks() {
    document.body.style.pointerEvents = 'auto';
}


// Change the 'Game info' board per 10 miliseconds
setInterval(() => {
    if (!game_over) {
        document.getElementById('board-size').innerHTML = COL + 'x' + ROW; // Board size (Row, Col)
        document.getElementById('total-cell').innerHTML = ROW * COL; // Number of tiles
        document.getElementById('total-bomb').innerHTML = NUMBER_OF_BOMBS; // Number of bombs

        try {
            revealedTiles = countRevealedTiles();
            document.getElementById('total-cell-covered').innerHTML = ROW * COL - revealedTiles; // Number of hidden tiles
            document.getElementById('total-cell-revealed').innerHTML = revealedTiles; // Number of revealed tiles
            checkForGameWin();
        } catch {
            document.getElementById('total-cell-covered').innerHTML = ROW * COL;
            document.getElementById('total-cell-revealed').innerHTML = 0;
        }
    }
}, 10);


// Update time per second
setInterval(() => {
    if (run)
        timeElapsed++;
    timer.innerHTML = timeElapsed;
}, 1000);


// Reload the page if 'Change Board' button is clicked
shuffleBoardBtn.forEach(btn => btn.addEventListener('click', function () {
    shuffleBoard();
}));

// Restart the current level
restartLevel.forEach(btn => btn.addEventListener('click', function () {
    restartCurrentLevel();
}));

// Show popup for changing number of row, columns and bombs
gridBtn.forEach(btn => btn.addEventListener('click', function () {
    adjustGrid();
}));

// Cancel popup for changing number of row, columns and bombs
cancelBtn.forEach(btn => btn.addEventListener('click', function () {
    cancelGridChange();
}));


// Set board size for CUSTOM board
document.querySelector('#custom .setBoard').addEventListener('click', function () {
    setBoardSize('custom');
});

// Set board size for BEGINNER board
document.querySelector('#beginner .setBoard').addEventListener('click', function () {
    setBoardSize('beginner');
});

// Set board size for INTERMEDIATE board
document.querySelector('#intermediate .setBoard').addEventListener('click', function () {
    setBoardSize('intermediate');
});

// Set board size for EXPERT board
document.querySelector('#expert .setBoard').addEventListener('click', function () {
    setBoardSize('expert');
});

// Pause the game by clicking pause button
document.querySelector('.pauseButton').addEventListener('click', function() {
    pauseGame();
});

// Resume the game by clicking resume button
document.querySelector('.resumeButton').addEventListener('click', function() {
    resumeGame();
});

// Set theme on selecting a theme
document.getElementById('themes').addEventListener('change', function() {
    setTheme(this);
});
