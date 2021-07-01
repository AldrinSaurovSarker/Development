const allBoxes = document.querySelectorAll('section span');
const board = document.querySelector('.board');
const choices = document.querySelector('.choice');
const resultMessage = document.getElementById('msg');

const your_turn = document.getElementById('y-turn');
const comp_turn = document.getElementById('c-turn');

const clickSound = new Audio('assets/audio/click.m4a');
const victorySound = new Audio('assets/audio/victory.wav');
const defeatSound = new Audio('assets/audio/defeat.mp3');
const drawSound = new Audio('assets/audio/draw.wav');

let playerSign, compSign;
let turns = 0;
let gameOver = false;
let lockBoard = false;

let priorityTable = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
let boardArray = [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']];

/* On window loading */
window.addEventListener('load', function() {
    turns = 0;

    /* Add onclick function to all boxes */
    for (let i=0; i<allBoxes.length; i++) {
        allBoxes[i].setAttribute('onclick', 'boxClicked(this)');
    }

    /* If player selects 'O' */
    document.getElementById('p1').addEventListener('click', function() {
        clickSound.play();
        playerSign = 'O';
        compSign = 'X';
        choices.style.visibility = 'hidden';
        board.style.visibility = 'visible';
        document.getElementById('y-icon').innerHTML = '<i class="far fa-circle"></i>';
    });

    /* If player selects 'X' */
    document.getElementById('p2').addEventListener('click', function() {
        clickSound.play();
        playerSign = 'X';
        compSign = 'O';
        choices.style.visibility = 'hidden';
        board.style.visibility = 'visible';
        document.getElementById('y-icon').innerHTML = '<i class="fas fa-times"></i>';

        /* Computer's turn is first if player selects 'X' */
        your_turn.classList.remove('active');
        comp_turn.classList.add('active');

        let randomDelay = Math.floor(Math.random() * 1000) + 500;
        lockBoard = true;

        setTimeout(function() {
            compTurn();
        }, randomDelay);
    });
});


/* Update the board in array */
function updateBoardArray(val, symbol) {
    boardArray[Math.floor((val - 1)/3)][(val - 1) % 3] = symbol;
}


/* When player clicks a box */
function boxClicked(element) {
    if (gameOver) // Return if game is over
        return;

    if (lockBoard) // Return if it's computer's turn
        return;

    /* Draw symbol in box */
    if (playerSign == 'X')
        element.innerHTML = '<i class="fas fa-times"></i>';
    else
        element.innerHTML = '<i class="far fa-circle"></i>';
    
    updateBoardArray(Number(element.className[3]), playerSign); // Sent the number of class (i.e, 1 for class 'box1').

    element.setAttribute('style', 'pointer-events: none'); // Lock the box so it's can't be clicked again.
    element.setAttribute('data-symbol', playerSign); // Assign data (O/X) to boxes.
    turns++;
    clickSound.play();

    let randomDelay = Math.floor(Math.random() * 1000) + 500; // Random time after which computer plays    
    checkWinner(playerSign); // Check if player has won
    lockBoard = true; 

    /* Whose turn is now */
    if (!gameOver) {
        your_turn.classList.remove('active');
        comp_turn.classList.add('active');
    }

    /* Computer's turn */
    setTimeout(function() {
        compTurn();
    }, randomDelay);
}


/* Computer's turn */
function compTurn() {
    /* Return if game is over */
    if (gameOver)
        return;

    /* Get the box which the computer should choose */
    setPriority();
    const compSelect = document.querySelector('.box' + getMaxPriorIndex());

    /* Put computer sign */
    if (playerSign == 'X')
        compSelect.innerHTML = '<i class="far fa-circle"></i>';
    else
        compSelect.innerHTML = '<i class="fas fa-times"></i>';

    turns++;
    updateBoardArray(Number(compSelect.className[3]), compSign);
    compSelect.setAttribute('data-symbol', compSign); // Assign data (O/X) to boxes.
    compSelect.style.pointerEvents = 'none'; // Lock the box so it can't be clicked again.
    checkWinner(compSign); // Check if computer has won
    your_turn.classList.add('active');
    comp_turn.classList.remove('active');
    lockBoard = false;
}


/* Return which symbol is in a particular box */
function getClass(value) {
    return document.querySelector('.box' + value).dataset.symbol;
}


/* Return true if 3 given boxes has given symbol, else false */
function checkCombination(val1, val2, val3, symbol) {
    if (getClass(val1) == symbol && getClass(val2) == symbol && getClass(val3) == symbol)
        return true;
    else
        return false;
}


/* Check winning combinations */
function checkWinner(sign) {
    if (checkCombination(1, 2, 3, sign) || checkCombination(4, 5, 6, sign) || checkCombination(7, 8, 9, sign) || checkCombination(1, 4, 7, sign) ||
        checkCombination(2, 5, 8, sign) || checkCombination(3, 6, 9, sign) || checkCombination(1, 5, 9, sign) || checkCombination(3, 5, 7, sign)) {
            gameOver = true;

            if (playerSign == sign)
                showMessage('You won!', 'Keep it up!', victorySound, '#28a745');
            else
                showMessage('You lost...', 'Better luck next time!', defeatSound, '#dc3545');
        }

    /* If all boxes are filled, but no winner */
    else if (turns == 9) {
        gameOver = true;
        showMessage('Game drawn.', 'You found your match at last!', drawSound, '#ffc107');
    }
}


/* Display result message */
function showMessage(message, submessage, sound, color) {
    setTimeout(function() {
        sound.play();
        board.style.visibility = 'hidden';
        document.querySelector('.result').style.visibility = 'visible';
        document.getElementById('sub-msg').innerHTML = submessage;
        resultMessage.innerHTML = message;
        resultMessage.style.color = color;
    }, 1000);
}


/* Set priorities to the boxes for computer to choose */
function setPriority() {
    /* Assign medium priority */
    /* Rows */
    for (let i=0; i<3; i++) {
        if (boardArray[i][0] == playerSign && playerSign == boardArray[i][1])
            priorityTable[i][2] = 2;
        if (boardArray[i][0] == playerSign && playerSign == boardArray[i][2])
            priorityTable[i][1] = 2;
        if (boardArray[i][1] == playerSign && playerSign == boardArray[i][2])
            priorityTable[i][0] = 2;
    }

    /* Columns */
    for (let i=0; i<3; i++) {
        if (boardArray[0][i] == playerSign && playerSign == boardArray[1][i])
            priorityTable[2][i] = 2;
        if (boardArray[0][i] == playerSign && playerSign == boardArray[2][i])
            priorityTable[1][i] = 2;
        if (boardArray[1][i] == playerSign && playerSign == boardArray[2][i])
            priorityTable[0][i] = 2;
    }

    /* Main Diagonal */
    {
        if (boardArray[0][0] == playerSign && playerSign == boardArray[1][1])
            priorityTable[2][2] = 2;
        if (boardArray[0][0] == playerSign && playerSign == boardArray[2][2])
            priorityTable[1][1] = 2;
        if (boardArray[1][1] == playerSign && playerSign == boardArray[2][2])
            priorityTable[0][0] = 2;
    }

    /* Secondary Diagonal */
    {
        if (boardArray[2][0] == playerSign && playerSign == boardArray[1][1])
            priorityTable[0][2] = 2;
        if (boardArray[2][0] == playerSign && playerSign == boardArray[0][2])
            priorityTable[1][1] = 2;
        if (boardArray[1][1] == playerSign && playerSign == boardArray[0][2])
            priorityTable[2][0] = 2;
    }

    /* Assign highest priority */
    /* Rows */
    for (let i=0; i<3; i++) {
        if (boardArray[i][0] == compSign && compSign == boardArray[i][1])
            priorityTable[i][2] = 3;
        if (boardArray[i][0] == compSign && compSign == boardArray[i][2])
            priorityTable[i][1] = 3;
        if (boardArray[i][1] == compSign && compSign == boardArray[i][2])
            priorityTable[i][0] = 3;
    }

    /* Columns */
    for (let i=0; i<3; i++) {
        if (boardArray[0][i] == compSign && compSign == boardArray[1][i])
            priorityTable[2][i] = 3;
        if (boardArray[0][i] == compSign && compSign == boardArray[2][i])
            priorityTable[1][i] = 3;
        if (boardArray[1][i] == compSign && compSign == boardArray[2][i])
            priorityTable[0][i] = 3;
    }

    /* Main Diagonal */
    {
        if (boardArray[0][0] == compSign && compSign == boardArray[1][1])
            priorityTable[2][2] = 3;
        if (boardArray[0][0] == compSign && compSign == boardArray[2][2])
            priorityTable[1][1] = 3;
        if (boardArray[1][1] == compSign && compSign == boardArray[2][2])
            priorityTable[0][0] = 3;
    }

    /* Secondary Diagonal */
    {
        if (boardArray[2][0] == compSign && compSign == boardArray[1][1])
            priorityTable[0][2] = 3;
        if (boardArray[2][0] == compSign && compSign == boardArray[0][2])
            priorityTable[1][1] = 3;
        if (boardArray[1][1] == compSign && compSign == boardArray[0][2])
            priorityTable[2][0] = 3;
    }

    /* Boxes that has values */
    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if (boardArray[i][j] != '-')
                priorityTable[i][j] = 0;
        }
    }
}


function getMaxPriorIndex() {
    let maxValue = -1, a = 0, b = 0;
    let maxids1 = [], maxids2 = [];

    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if (priorityTable[i][j] > maxValue)
                maxValue = priorityTable[i][j];
        }
    }

    for (let i=0; i<3; i++) {
        for (let j=0; j<3; j++) {
            if (priorityTable[i][j] == maxValue) {
                maxids1[a++] = i;
                maxids2[b++] = j;                
            }
        }
    }

    let randomValue = Math.floor(Math.random() * a);
    return maxids1[randomValue] * 3 + maxids2[randomValue] + 1;
}
