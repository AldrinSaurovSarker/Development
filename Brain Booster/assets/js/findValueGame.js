class findValueGame {
    /* let arr is any inside values.
    * The 1st index of arr means the number which will be allover the board
    * The 2nd index of arr means the number which has to be found
    * The 3rd index of arr means the type of character we have to find out */
    #values = [
        [['8', '3', 'number'], ['T', 'I', 'letter']], // Easy
        [['9', '8', 'number'], ['7', '1', 'number']], // Medium
        [['B', '8', 'number'], ['M', 'N', 'letter']], // Hard
        [['W', 'V', 'letter'], ['Q', 'O', 'letter']], // Very Hard
    ]

    #currentStage = 1; // Current stage player at

    #timeTotal; // width of the timer div
    #timeElasped = 0; // For increasing line timer width
    #totalElaspedTime = 0; // To calculate how many stars player got
    #counterLine;

    #randomPosition; // Where the imposter value will be situated
    #randomValue; // which pair of numbers/alphabets should be shown


    /* Constructor */
    constructor(width=10, height=10, gridLength='45px', gridGap='5px', timeOut=10000, totalStage=4) {
        this.width = width; // Number of square in a row
        this.height = height; // Number of square in a column
        this.gridLength = gridLength; // length of each square
        this.gridGap = gridGap; // Gap between each squares
        this.timeOut = timeOut; // Time for answer a question (miliseconds)
        this.totalStage = totalStage; // Total number of stages

        // Set number of cells per row and column in css.
        document.documentElement.style.setProperty('--grid-per-column', width);
        document.documentElement.style.setProperty('--grid-per-row', height);

        /* Assign value of 'gridLength' to '--grid-length' in :root' */
        document.documentElement.style.setProperty('--grid-length', gridLength);
        document.documentElement.style.setProperty('--grid-gap', gridGap);
    }


    /* Get an Integer random value from 0 to num */
    getRandomValue(num) {
        return Math.floor(Math.random() * num);
    }


    /* Set random valueset and random position */
    randomizeBoard() {
        // randomValue: which pair of numbers/alphabets should be shown
        // randomPosition: Where the imposter value will be situated
        this.#randomValue = this.getRandomValue(this.#values[this.#currentStage-1].length);
        this.#randomPosition = this.getRandomValue(this.width * this.height);
    }


    // Put values in instruction box and game board
    putValues() {    
        // introduction box
        document.querySelector('.introduction').innerHTML =
        "Find and click the " + this.#values[this.#currentStage-1][this.#randomValue][2] + " '" +
        this.#values[this.#currentStage-1][this.#randomValue][1] + "'";

        // Create the board    
        for (let i=0; i<this.width * this.height; i++) {
            // For multiple levels, reset properties that could have been changed in the last level
            const square = document.getElementById(i); 
            square.style.border = 'none';
            square.style.pointerEvents = 'auto';

            // Put the imposter letter and the normal letters
            if (i == this.#randomPosition) {
                square.innerHTML = this.#values[this.#currentStage-1][this.#randomValue][1];
            }
            else
                square.innerHTML = this.#values[this.#currentStage-1][this.#randomValue][0];
        }
    }


    // Calculate max time elasped for line timer
    setTimerProperties() {
        // Get the width of timer div for line timer
        this.#timeTotal = this.width * (parseInt(this.gridLength) + 2*parseInt(this.gridGap));
        this.#totalElaspedTime += (this.#timeElasped * this.timeOut)/this.#timeTotal;
        this.#timeElasped = 0;
    }


    // Draw gameboard on window
    createBoard() {
        const gameWindow = document.querySelector('.gameWindow');
    
        // Create instruction box and game board
        const timer = document.createElement('div');
        timer.className = 'timer mb-4';
    
        const introduction = document.createElement('div');
        introduction.className = 'introduction';
    
        const board = document.createElement('div');
        board.className = 'board calculated-board';
    
        // Append in the game window
        gameWindow.appendChild(introduction);
        gameWindow.appendChild(timer);
        gameWindow.appendChild(board);
    
        // Create the board    
        for (let i=0; i<this.width * this.height; i++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.setAttribute('id', i);
            board.appendChild(square);
        }
    }


    // Stop timer and click ability
    stopActions() {
        // Stop line timer
        clearInterval(this.#counterLine);

        // Making all squares unclickable after once result is shown
        for (let i=0; i<this.width * this.height; i++) {
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }


    // Defeat in game
    gameover(res, id=null) {
        this.stopActions();

        if (res == 'victory') {
            // If target score reached, stage is cleared
            if (this.#currentStage == this.totalStage) {
                this.updatePlayerProgress(); // Unlock the next level
                this.showInstruction('victory');
            }

            // Go to the next round
            else {
                this.#currentStage++;
                this.showInstruction();
            }
        }
            
        else {
            // Green border at the square which player just failed to find
            document.getElementById(this.#randomPosition).style.backgroundColor = '#0f0';

            // Red border at the wrong clicked square
            if (id != null) {
                document.getElementById(id).style.backgroundColor = '#dc3545';

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
    
        if (playerLevel == '1') {
            localStorage.setItem('playerLevel', 2);
        }
    }


    // Check for correct/wrong click
    checkPlayerMove(id) {
        // Checking result
        if (id == this.#randomPosition)
            this.gameover('victory')
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
        var self = this;
        for (let i=0; i<this.width * this.height; i++) {
            document.getElementById(i).addEventListener('click', function() {
                if (document.querySelector('.instructionWindow').style.display == 'none') {
                    self.checkPlayerMove(i);
                }
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
            instructionMessage.innerHTML = 'Better Luck next time';
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
            headings.innerHTML = 'Round ' + this.#currentStage + ' of ' + this.totalStage;
            instructionMessage.innerHTML = "Find and click the " + this.#values[this.#currentStage-1][this.#randomValue][2]
            + " '" + this.#values[this.#currentStage-1][this.#randomValue][1] + "'";

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
