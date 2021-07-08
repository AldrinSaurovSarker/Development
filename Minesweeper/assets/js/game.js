import { NUMBER_OF_BOMBS, ROW, COL, timeElapsed, disableClicks, activeClicks } from './description.js'
export var squares = [];
export var run = false
export var game_over = false;
export var game_started = false;
export var flags;
export const content = document.querySelector('.content');
export const resultBox = document.querySelector('.result-box');

const msg = document.getElementById('msg');
const board = document.getElementById('board');
const flagBoard = document.querySelector('.flags');
const tiles = document.getElementsByClassName('square');

const victorySound = new Audio('assets/audio/victory.wav');
const gameoverSound = new Audio('assets/audio/gameover.wav');
var digitColors =  ['blue', 'green', 'red', 'purple', 'black', 'gray', 'maroon', 'turquoise'];

// Different color for different digits on the game board
export function setDigitColors() {
    if (document.body.classList.contains('theme-light'))
        digitColors =  ['blue', 'green', 'red', 'purple', 'black', 'gray', 'maroon', 'turquoise'];
    else if (document.body.classList.contains('theme-dark'))
        digitColors =  ['cyan', 'lime', '#fe4747', '#ff38ca', 'black', 'yellow', '#c51717', 'turquoise'];
    else if (document.body.classList.contains('theme-nature'))
        digitColors =  ['cyan', 'lime', 'red', '#ff38ca', 'white', 'yellow', '#c51717', 'royalblue'];

    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            var box = squares[i][j]; 
            if (box.number > 0 && box.status == 'clicked') {
                box.draw.style.color = digitColors[box.number-1];
            }
        }
    }
}

// Count number of revealed tiles
export function countRevealedTiles() {
    let countTiles = 0;

    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            if (squares[i][j].status == 'clicked') {
                countTiles++;
            }
        }
    }

    return countTiles;
}


// run is a boolean variable indicating the timer is running or not
// Function is used to change value in other modules
export function setTimer(value) {
    run = value;
}


// game_over is a boolean variable to indicate if game is over
// Function is used to change value in other modules
export function setGameOver(value) {
    game_over = value;
}


// Set the number of placable flags to default
export function resetFlags() {
    flags = NUMBER_OF_BOMBS;
    flagBoard.innerHTML = flags;
}


// Placing bomb after first click so that first click will never trigger a bomb
function firstClick(i, j) {
    game_started = true;
    setGameOver(false);
    placeBombs(i, j);
    placeNumbers();
    setTimer(true);
}


// Draw the board according to number of rows and columns
export function drawBoard() {
    game_started = false;
    board.innerHTML = '';
    squares.length = 0;

    for (let i=0; i<ROW; i++) {
        squares.push([]);
        for (let j=0; j<COL; j++) {
            // An object for each tile.
            // 1. number: number of bombs around a tile. -1 means this tile itself a bomb
            // 2. draw: used for UI design
            // 3. status:
            //     'clickable' means player can click on this tile.
            //     'clicked' means this tile can't be clicked (already clicked/game over).
            //     'flagged' means this tile has been flagged as bomb and hence can't be clicked unless it's unflagged

            var block = {
                number: 0,
                draw: createSquare(i*25, j*25, i, j),
                status: 'clickable'
            }
            squares[i].push(block);
        }
    }
}


// Put bombs in random cells
function placeBombs(fi, fj) {
    for (let i=0; i<NUMBER_OF_BOMBS; i++) {
        // Selecting a random cell
        var randomY = Math.floor(Math.random() * ROW);
        var randomX = Math.floor(Math.random() * COL);

        // Bomb can't be where there is already a bomb or the cell which was clicked at first
        if (squares[randomY][randomX].number == -1 || (randomY == fi && randomX == fj)) {
            i--;
        }

        // -1 indicactes a bomb
        else {
            squares[randomY][randomX].number = -1;
        }
    }
}


// Count bombs adjacence to a tile and assign the number of bombs in the tile
function placeNumbers() {
    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            // For perimeter tiles
            var surroundArea = {
                topY: 0,
                leftX: 0,
                bottomY: 0,
                rightX: 0
            }

            surroundArea.topY = Math.max(i-1, 0);
            surroundArea.leftX = Math.max(j-1, 0);
            surroundArea.bottomY = Math.min(i+1, ROW-1);
            surroundArea.rightX = Math.min(j+1, COL-1);

            // If a tiles contains any bomb, don't assign any number to it
            if (squares[i][j].number !== -1) {
                for (let x=surroundArea.topY; x<surroundArea.bottomY + 1; x++) {
                    for (let y=surroundArea.leftX; y<surroundArea.rightX + 1; y++) {
                        if (squares[x][y].number == -1)
                            squares[i][j].number++;
                    }
                }
            }
        }
    }
}


// Create an indivisual tiles in the board
function createSquare(top, left, posX, posY) {
    var sqr = document.createElement('div');
    sqr.style.top = top + 'px';
    sqr.style.left = left + 'px';
    sqr.classList.add('square');
    board.appendChild(sqr);

    return sqr;
}


// When a bomb is triggered, reveal all other bombs in the gameboard
function revealAllBombs(eX, eY) {
    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            // Bombs under flags won't be revealed when a bomb is triggered
            if (squares[i][j].number == -1 && squares[i][j].status != 'flagged') {
                squares[i][j].draw.innerHTML = '<i class="fas fa-bomb"></i>';
                squares[i][j].draw.classList.add('revealed');
                squares[i][j].draw.style.fontSize = '16px';
            }
        }
    }
}


// Reveal a particular square on click
function revealSquare(x, y) {
    var box = squares[x][y];

    if (box.status != 'clickable') {
        return;
    }

    box.draw.classList.add('revealed');

    // Reveal all nearby boxes if clicked on an empty cell
    if (box.number == 0) {
        box.status = 'clicked'; 

        // For cells in the perimeter
        var surroundArea = {
            topY: 0,
            leftX: 0,
            bottomY: 0,
            rightX: 0
        }

        surroundArea.topY = Math.max(x-1, 0);
        surroundArea.leftX = Math.max(y-1, 0);
        surroundArea.bottomY = Math.min(x+1, ROW-1);
        surroundArea.rightX = Math.min(y+1, COL-1);

        // Reveal neighbouring tiles of an empty tile
        for (let x1=surroundArea.topY; x1<surroundArea.bottomY + 1; x1++) {
            for (let y1=surroundArea.leftX; y1<surroundArea.rightX + 1; y1++) {
                revealSquare(x1, y1);
            }
        }
    }

    // Reveal boxes with a number
    else if (box.number > 0) {
        box.draw.innerHTML = box.number;
        box.draw.style.color = digitColors[box.number-1];
        box.status = 'clicked';  
    }

    // Clicked on a bomb. Reveal all other bombs
    else if (box.number == -1) {
        setTimer(false);
        box.draw.innerHTML = '<i class="fas fa-bomb"></i>';
        box.draw.classList.add('bombed');
        revealAllBombs(x, y);
        gameover('Lost');
    }
}


// Flag/unflag tiles
function flagSquare(x, y, end=false) {
    var box = squares[x][y];

    // If tile isn't flagged, add a flag
    if (box.status == 'clickable') {
        flags--;
        flagBoard.innerHTML = flags;
        box.status = 'flagged';
        box.draw.classList.add('flagged');
        box.draw.innerHTML = '<i class="fas fa-flag"></i>';
    }

    // If a tile is already flagged, remove the flag
    else if (box.status == 'flagged' && !end) {
        flags++;
        flagBoard.innerHTML = flags;
        box.status = 'clickable';
        box.draw.classList.remove('flagged');
        box.draw.innerHTML = '';
    }
}

// Flag all bombs when player wins
export function flagAllSquares() {
    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            if (squares[i][j].number == -1)
                flagSquare(i, j, true);
        }
    }
}


// Unflag all squares when a game is over
export function unflagAllSquares() {
    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            squares[i][j].draw.classList.remove('flagged');
        }
    }
}


// Gameover popup message. tag contains result (win/lose)
export function gameover(tag) {
    setGameOver(true);
    disableClicks();

    // h1 colors for different result
    const res = {
        'Lost': ['#bc2130', gameoverSound],
        'Won': ['#28a745', victorySound]
    }

    // Play victory/defeat sound
    res[tag][1].play();

    // Make all the tiles unclickable after win/lose
    for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
            squares[i][j].status = 'clicked';
        }
    }

    // Result popup shown after 3 seconds
    setTimeout(() => {
        document.getElementById('timeSpent').innerHTML = timeElapsed;
        msg.innerHTML = 'You ' + tag;
        msg.style.color = res[tag][0];
        resultBox.style.display = 'flex';
        content.classList.add('blurred');
        activeClicks();
    }, 3000);
}


// Create a board with window loading and reset flags to default
window.onload = () => {
    drawBoard();
    resetFlags();
    setBtnProperties();
}


// Prevent right mouse button from working except flagging
window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
}, false);


// Options are allowed to click after board is created
export function setBtnProperties() {
    setTimeout(() => {
        for (let i=0; i<ROW; i++) {
            for (let j=0; j<COL; j++) {
                const c = tiles[COL*i + j];

                // Reveal square on LEFT MOUSE CLICK
                c.addEventListener('click', function() {
                    // Indicates if it's the first click
                    if (!game_started) {
                        firstClick(i, j);
                    }
                    revealSquare(i, j);
                });
        
                // Mark a tile as flagged on RIGHT MOUSE CLICK
                c.addEventListener('contextmenu', function() {
                    flagSquare(i, j);
                });
            }
        }        
    }, 1000);
}
