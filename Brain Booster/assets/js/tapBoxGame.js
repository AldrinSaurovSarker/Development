class tapBoxGame {
    #values = ['red', 'green', 'blue', 'purple', 'yellow']; // Colors to choose from
    #stageType = ["Click", "Don't Click"] // Round type

    #score = 0; // Score obtained
    #TOTAL_BOXES = 3; // Number of boxes visible at game board

    #randomTextColor; // Color of text in instruction block
    #randomBoxColor; // Color has to be touched
    #randomThirdColor; // Any third color apart from the text color and box color
    #randomTextPosition; // Box position which will have the color of the text in instruction
    #randomBoxPosition; // Box position which needs to be touched
    #randomStageType; // Randomly choice CLICK or DON'T CLICK objective 

    #timeTotal; // width of the timer div
    #timeElasped = 0; // For increasing line timer width
    #totalElaspedTime = 0;
    #counterLine; // For timer line


    /* Constructor */
    constructor(boardLength='500px', gridGap='5px', timeOut=10000, gameScore=6) {
        this.boardLength = boardLength; // Width of game board
        this.gridGap = gridGap; // Gap between each squares
        this.timeOut = timeOut; // Time for answer a question (miliseconds)
        this.gameScore = gameScore; // Game point

        /* Assign value of 'gridLength' to '--grid-length' in :root' */
        document.documentElement.style.setProperty('--grid-gap', gridGap);
        document.documentElement.style.setProperty('--board-length', boardLength);
    }


    /* Get an Integer random value from 0 to num except 'preventValue' */
    getRandomValue(num, preventValue=null) {
        var randomValue = Math.floor(Math.random() * num);

        if (preventValue) { // If any array is provided
            while (preventValue.includes(randomValue)) { // If random value is in preventValue array, reget random value 
                randomValue = Math.floor(Math.random() * num);
            }
        }

        return randomValue;
    }


    /* Set game properties */
    randomizeBoard() {
        // Get 3 distinct text colors
        this.#randomTextColor = this.getRandomValue(this.#values.length);
        this.#randomBoxColor = this.getRandomValue(this.#values.length, [this.#randomTextColor]);
        this.#randomThirdColor = this.getRandomValue(this.#values.length, [this.#randomTextColor, this.#randomBoxColor]);
        
        // Set position of the colors
        this.#randomTextPosition = this.getRandomValue(this.#TOTAL_BOXES);
        this.#randomBoxPosition = this.getRandomValue(this.#TOTAL_BOXES, [this.#randomTextPosition]);

        // Get game objective : CLICK or DON'T CLICK
        this.#randomStageType = this.getRandomValue(this.#stageType.length);
    }


    // Put values in instruction box and game board
    putValues() {
        this.randomizeBoard();
    
        // Round steps information
        document.querySelector('.current-round').innerHTML = (this.#score + 1) + ' of ' + this.gameScore;

        // Instruction box. Display color name with a different color to confuse user
        document.querySelector('.instruction').innerHTML = 
            this.#stageType[this.#randomStageType] + ' the <span class="mx-2 text-uppercase" style="color:' +
            this.#values[this.#randomTextColor] + '"> ' + this.#values[this.#randomBoxColor] + '</span> box';

        // Create the board    
        for (let i=0; i<this.#TOTAL_BOXES; i++) {
            // For multiple levels, reset properties that could have been changed in the last level
            const square = document.getElementById(i);

            // Color boxes
            if (i == this.#randomTextPosition)
                square.style.backgroundColor = this.#values[this.#randomTextColor];
            else if (i == this.#randomBoxPosition)
                square.style.backgroundColor = this.#values[this.#randomBoxColor];
            else
                square.style.backgroundColor = this.#values[this.#randomThirdColor];
        }
    }


    // Calculate max time elasped for line timer
    setTimerProperties() {
        // Get the width of timer div for line timer
        this.#timeTotal = parseInt(this.boardLength);
        this.#totalElaspedTime += (this.#timeElasped * this.timeOut)/this.#timeTotal;
        this.#timeElasped = 0;
    }


    // Draw gameboard on window
    createBoard() {
        const gameWindow = document.querySelector('.gameWindow');
    
        // Create instruction box and game board
        const timer = document.createElement('div');
        timer.className = 'timer';
        const board = document.createElement('div');
        board.className = 'board fixed-board';
    
        // Append in the game window
        gameWindow.appendChild(timer);
        gameWindow.appendChild(board);
    
        // Append the round-info and instruction space
        const roundInfo = document.createElement('div');
        roundInfo.className = 'current-round';
        board.appendChild(roundInfo);

        const instruction = document.createElement('div');
        instruction.className = 'instruction';
        board.appendChild(instruction);

        // Container for boxes
        const boxContainer = document.createElement('div');
        boxContainer.className = 'box-container';
        board.appendChild(boxContainer);

        // Create the board
        for (let i=0; i<3; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.setAttribute('id', i);
            boxContainer.appendChild(box);
        }
    }


    // Stop timer and click ability
    stopActions() {
        // Stop line timer
        clearInterval(this.#counterLine);

        // Making all squares unclickable after once result is shown
        for (let i=0; i<this.#TOTAL_BOXES; i++) {
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }


    // Defeat in game
    gameover(res, id=null) {
        if (res == 'victory') {
            this.#score++; // Increase score

            // Game will finally be over after achieving a particular score
            if (this.#score == this.gameScore) {
                this.updatePlayerProgress(); // Unlock the next level
                this.stopActions();
                this.showInstruction('victory');
            }

            /* If gamescore hasn't been reached yet, rechoice the colors.
            Put them in boxes randomly to choose again */
            else {
                this.putValues();
            }
        }

        else {
            this.stopActions();

            // GREEN border at the square which player just failed to find
            document.getElementById(this.#randomBoxPosition).style.border = '5px solid #0f0';

            // RED border at the wrong clicked square
            if (id != null) {
                document.getElementById(id).style.border = '5px solid #f00';

                setTimeout(() => { // SetTimeout to make sure the boxShadow property work first before alert
                    this.showInstruction('defeat misclick');
                }, 3000);
            }

            else {
                setTimeout(() => { // SetTimeout to make sure the boxShadow property work first before alert
                    this.showInstruction('defeat timeout');
                }, 3000);
            }
        }
    }


    // Increase player level
    updatePlayerProgress() {
        const playerLevel = localStorage.getItem('playerLevel');
    
        if (playerLevel == '2') {
            localStorage.setItem('playerLevel', 3);
        }
    }


    // Check for correct/wrong click
    checkPlayerMove(id) {
        // Checking result

        // If stage is to click a box, clicking the box will result victory
        if (this.#randomStageType == 0) {
            if (id == this.#randomBoxPosition)
                this.gameover('victory')
            else
                this.gameover('defeat', id);
        }

        // If stage is not to click a box, clicking the box will result defeat
        else {
            if (id != this.#randomBoxPosition)
                this.gameover('victory')
            else
                this.gameover('defeat', id);
        }
    }


    // Line Timer (calculation)
    lineTimer() {
        const time_line = document.querySelector('.timer');
        this.#timeElasped++;

        time_line.style.width = this.#timeElasped + 'px'; // increasing width of time_line by time value
        
        // When timeElasped reaches timeTotal, it means time has passed for each answer
        if(this.#timeElasped > this.#timeTotal) {
            this.gameover('defeat');
        }
    }


    // Line Timer (setup)
    startTimerLine() {
        /* TimeInterval value logic:
        * 'timeTotal' contains the width of '.timer'
        * We are increasing width by one pixel
        * So the value of 'timeElasped' should be 'timeTotal' in 'timeOut' seconds
        * Therefore value of 'timeElasped' should in be increased by one in 'timeOut/timeTotal' seconds
        */

        var self = this; // Passing object as 'self' because 'this' in setInterval is actually setInterval object

        this.#counterLine = setInterval(function() {
            self.lineTimer();
        }, this.timeOut/this.#timeTotal);
    }


    // Actions when player hit keyboard keys or click mouse buttons
    playerAction() {
        var self = this; // As after click, this will refer to box instance instead of game instance

        for (let i=0; i<this.#TOTAL_BOXES; i++) {
            document.getElementById(i).addEventListener('click', function() {
                self.checkPlayerMove(i);
            })
        }
    }


    // Display the instruction page before every round starts
    showInstruction(status='playing') {
        const instructionWindow = document.querySelector('.instructionWindow');
        const headings = document.querySelector('.instructionWindow h1');
        const instructionMessage = document.querySelector('.instructionWindow h3');
        const gameWindow = document.querySelector('.gameWindow');
        const gameoverBtn = document.querySelector('.gameOverButtons');
        const continueBtn = document.getElementById('continue');
        const nextLevelBtn = document.querySelector('.nextLevel');
        const resultStarsParent = document.querySelector('.result-stars');
        const self = this;

        gameWindow.style.display = 'none';
        instructionWindow.style.display = 'flex';

        if (status == 'victory') {
            this.setTimerProperties();

            resultStarsParent.style.display = 'flex';
            var starObtained = calculateStar(this.#totalElaspedTime);
            const resultStars = resultStarsParent.children;

            for (let i=0; i<resultStars.length; i++) {
                if (i < starObtained)
                    resultStars[i].style.color = '#ffa500';
                else
                    resultStars[i].style.color = '#777777';
            }

            headings.innerHTML = 'CONGRATULATIONS!'
            instructionMessage.innerHTML = 'You are fast like a rocket';
            continueBtn.style.display = 'none';
            gameoverBtn.style.display = 'flex';
        }

        else if (status == 'defeat misclick') {
            headings.innerHTML = 'Wrong Choice!';
            instructionMessage.innerHTML = 'Better read the statements carefully';
            continueBtn.style.display = 'none';
            gameoverBtn.style.display = 'flex';
            nextLevelBtn.style.display = 'none';
        }

        else if (status == 'defeat timeout') {
            headings.innerHTML = "Time's up!";
            instructionMessage.innerHTML = 'You have to be faster';
            continueBtn.style.display = 'none';
            gameoverBtn.style.display = 'flex';
            nextLevelBtn.style.display = 'none';
        }

        else {
            this.randomizeBoard(); // Put values to show in instruction box
            headings.innerHTML = 'Click the correct boxes.'

            continueBtn.addEventListener('click', function() {
                if (gameWindow.style.display == 'none') {
                    gameWindow.style.display = 'block';
                    instructionWindow.style.display = 'none';
                    
                    self.playStage();
                }
            });
        }
    }


    // Restart a game
    playStage() {
        this.setTimerProperties();
        this.startTimerLine(this.#timeTotal);
        this.putValues();
        this.playerAction();
    }


    // Game
    gameloop() {
        this.createBoard();
        this.showInstruction();
    }
}