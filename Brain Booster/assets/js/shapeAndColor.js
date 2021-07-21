class shapeAndColorGame {
    /* let arr is any inside values.
    * The 1st index of arr means the number which will be allover the board
    * The 2nd index of arr means the number which has to be found
    * The 3rd index of arr means the type of character we have to find out */
    #colors = ['red', 'green', 'blue', 'purple', 'yellow'];
    #shapes = ['circle', 'square'];
    #questionTypeAll = ['simple', 'complex'];

    #currentRound = 1;
    #totalRound = 2;

    #score = 0; // Score obtained
    #TOTAL_OPTIONS = 2; // Number of options visible at game board

    #timeTotal; // width of the timer div
    #timeElasped = 0; // For increasing line timer width
    #totalElaspedTime = 0; // To calculate how many stars player got
    #counterLine; // For line timer


    /* Constructor */
    constructor(boardLength='500px', gridGap='5px', timeOut=15000, gameScore=6) {
        this.boardLength = boardLength; // Width of game board
        this.gridGap = gridGap; // Gap between each squares
        this.timeOut = timeOut; // Time for answer a question (miliseconds)
        this.gameScore = gameScore; // Total score to win

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
        if (this.#currentRound == 1)
            this.questionType = 0;
        else
            this.questionType = this.getRandomValue(this.#questionTypeAll.length);

        this.randomColor = this.getRandomValue(this.#colors.length); // Pick a random correct color (to draw)
        this.randomShape = this.getRandomValue(this.#shapes.length); // Pick a random correct shape (to draw)
        
        /* There are 4 type of stages
            1. Affirmative sentence, answer is TRUE
            2. Negative sentence, answer is TRUE
            3. Negative sentence, answer is FALSE
            4. Affirmative sentence, answer is FALSE
        */
        this.roundType = this.getRandomValue(4) + 1;

        // If round type is 1 or 3, the correct shape and color will be given in question statement
        if (this.roundType % 2 == 1) {
            this.randomQuestionColor = this.randomColor;
            this.randomQuestionShape = this.randomShape;

            this.randomThirdShape = this.getRandomValue(this.#shapes.length);

            if (this.randomThirdShape == this.randomShape)
                this.randomThirdColor = this.getRandomValue(this.#colors.length, [this.randomColor]);
            else
                this.randomThirdColor = this.getRandomValue(this.#colors.length);
        }

        // If round type is 1 or 3, the correct shape and color won't be given in question statement
        else {
            // Get another shape for in question
            this.randomQuestionShape = this.getRandomValue(this.#shapes.length);
            this.randomThirdShape = this.getRandomValue(this.#shapes.length);
            
            // If the new random shape is the same shape as previous, then color MUST BE different.
            // If the new random shape is different shape then previous, any color can be picked
            if (this.randomQuestionShape == this.randomShape)
                this.randomQuestionColor = this.getRandomValue(this.#colors.length, [this.randomColor]);
            else
                this.randomQuestionColor = this.getRandomValue(this.#colors.length);

            if (this.randomThirdShape == this.randomShape)
                this.randomThirdColor = this.getRandomValue(this.#colors.length, [this.randomColor]);
            else
                this.randomThirdColor = this.getRandomValue(this.#colors.length);
        }
    }


    // Put values in instruction box and game board
    putValues() {
        this.randomizeBoard(); // Get values
    
        // Round steps information
        document.querySelector('.current-round').innerHTML = (this.#score + 1) + ' of ' + this.gameScore;

        // intruction box
        if (this.questionType == 0) {
            document.querySelector('.instruction').innerHTML = 'This is ' + ((this.roundType == 1 || this.roundType == 4) ? 'a ' : 'not a ' ) 
        + this.#colors[this.randomQuestionColor] + ' ' + this.#shapes[this.randomQuestionShape];
        }

        else {
            document.querySelector('.instruction').innerHTML = 'This is ' + ((this.roundType == 1 || this.roundType == 4) ? 'a ' : 'not a ' ) 
            + this.#colors[this.randomQuestionColor] + ' ' + this.#shapes[this.randomQuestionShape] + 
            ((this.roundType == 1 || this.roundType == 4) ? ' or a ' : ' neither a ' ) + this.#colors[this.randomThirdColor] + ' ' + this.#shapes[this.randomThirdShape];
        }

        // Draw shape
        document.querySelector('.shape').innerHTML = '<i class="far fa-' + this.#shapes[this.randomShape] +
        ' fa-5x" style="color:' + this.#colors[this.randomColor] + '"></i>';

        // Assigning the correct answer id
        this.correctAnswerId = Math.floor((this.roundType-1)/2);

        // Create the options  
        for (let i=0; i<this.#TOTAL_OPTIONS; i++) {
            // For multiple levels, reset properties that could have been changed in the last level
            const square = document.getElementById(i);
            square.style.pointerEvents = 'auto';
            square.setAttribute('style', 'background-color: #ff0 !important');
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

        // Append the shape block
        const shape = document.createElement('div');
        shape.className = 'shape';
        board.appendChild(shape);

        // Container for boxes
        const boxContainer = document.createElement('div');
        boxContainer.className = 'box-container';
        board.appendChild(boxContainer);

        // Options
        const options = ['True', 'False'];

        // Create the board
        for (let i=0; i<this.#TOTAL_OPTIONS; i++) {
            const box = document.createElement('div');
            box.classList.add('box', 'box-hovered');
            box.style.backgroundColor =  '#ff0'; // Yellow background of buttons
            box.innerHTML = options[i]; // True or False
            box.setAttribute('id', i);
            boxContainer.appendChild(box);
        }
    }


    // Stop timer and click ability
    stopActions() {
        // Stop line timer
        clearInterval(this.#counterLine);

        // Making all squares unclickable after once result is shown
        for (let i=0; i<this.#TOTAL_OPTIONS; i++) {
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }


    // Defeat in game
    gameover(res, id=null) {
        if (res == 'victory') {
            this.#score++; // Increase score

            // Game will finally be over after achieving a particular score
            if (this.#score == this.gameScore) {
                this.stopActions();

                if (this.#currentRound != this.#totalRound) {
                    this.#score = 0;
                    this.#currentRound++;
                    this.showInstruction();
                }

                else {
                    this.updatePlayerProgress(); // Unlock the next level
                    this.showInstruction('victory');
                }
            }

            /* If gamescore hasn't been reached yet, rechoice the colors.
            Put them in boxes randomly to choose again */
            else {
                this.putValues();
            }
        }

        else {
            this.stopActions();

            // Green background at the square which player just failed to find
            document.getElementById(this.correctAnswerId).style.backgroundColor = '#0f0';
            document.getElementById(this.correctAnswerId).classList.remove('box-hovered');

            // Red background at the wrong clicked square
            if (id != null) {
                document.getElementById(id).style.backgroundColor = '#dc3545';
                document.getElementById(id).classList.remove('box-hovered');

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
    
        if (playerLevel == '5') {
            localStorage.setItem('playerLevel', 6);
        }
    }


    // Check for correct/wrong click
    checkPlayerMove(id) {
        // Checking result
        if (id == this.correctAnswerId)
            this.gameover('victory');
        else
            this.gameover('defeat', id);
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

        for (let i=0; i<this.#TOTAL_OPTIONS; i++) {
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
            instructionMessage.innerHTML = victoryMessage(starObtained);
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
            headings.innerHTML = 'Round ' + this.#currentRound + ' of ' + this.#totalRound;
            instructionMessage.innerHTML = 'Check the statement correct or not';

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
    }


    // Game
    gameloop() {
        this.createBoard();
        this.playerAction();
        this.showInstruction();
    }
}