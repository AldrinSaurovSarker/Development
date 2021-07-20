class wordLengthGame {
    /* WordList contains words of 7-9 letters */
    #wordList = [
        // 7-letter words
        ['academy', 'absense', 'counsil', 'diamond', 'anatomy', 'british', 'explore', 'holiday',
        'receipt', 'typical', 'wedding', 'witness', 'written'],
        
        // 8-letter words
        ['hostages', 'algebra', 'maintain', 'dinosaur', 'weekness', 'accurate', 'academic', 'colorful', 'computer',
        'daylight', 'eighteen', 'facebook', 'guardian', 'internal', 'junction', 'language', 'medicine', 'notebook',
        'original', 'parallel', 'question', 'resourse', 'standard', 'tomorrow', 'umbrella', 'valuable', 'wildlife'],
        
        // 9-letter words
        ['aftermath', 'negotiate', 'professor', 'exception', 'direction', 'nightmare', 'obsession',
        'algorithm', 'beginning', 'education', 'beautiful']
    ]

    #rounds = ['shortest', 'longest']; // Type of rounds

    #score = 0; // Score obtained
    #TOTAL_OPTIONS = 4; // Number of options visible at game board

    #timeTotal; // width of the timer div
    #timeElasped = 0; // For increasing line timer width
    #totalElaspedTime = 0;
    #counterLine; // For line timer


    /* Constructor */
    constructor(boardLength='500px', gridGap='25px', timeOut=15000, gameScore=6) {
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
        // a random 7-letter word
        this.shortestWord = this.getRandomValue(this.#wordList[0].length);
        
        // two different random 8-letter words
        this.otherFirstWord = this.getRandomValue(this.#wordList[1].length);
        this.otherSecondWord = this.getRandomValue(this.#wordList[1].length, [this.otherFirstWord]);

        // a random 9-letter word
        this.longestWord = this.getRandomValue(this.#wordList[2].length);

        // 0 -> Find the shortest word, 1 -> Find the longest word
        this.roundType = this.getRandomValue(2);
    }


    // Put values in instruction box and game board
    putValues() {
        this.randomizeBoard(); // Get values
    
        // Round steps information
        document.querySelector('.current-round').innerHTML = (this.#score + 1) + ' of ' + this.gameScore;

        // intruction box
        document.querySelector('.instruction').innerHTML = 'Find the ' + this.#rounds[this.roundType] + ' word';

        // Assigning the correct answer id
        this.correctAnswerId = this.roundType;

        // Create the options  
        for (let i=0; i<this.#TOTAL_OPTIONS; i++) {
            const square = document.getElementById(i);

            // Shortest word in id-0, Longest word in id-1, other words randomly
            if (i==0)
                square.innerHTML = this.#wordList[0][this.shortestWord];
            else if (i == 1)
                square.innerHTML = this.#wordList[2][this.longestWord];
            else if (i == 2)
                square.innerHTML = this.#wordList[1][this.otherFirstWord];
            else if (i == 3)
                square.innerHTML = this.#wordList[1][this.otherSecondWord];
        }

        this.shuffleOptions(); // Shuffle the options
    }


    // Shuffle Options
    shuffleOptions() {
        for (let i=0; i<this.#TOTAL_OPTIONS; i++) {
            var randomPlace = Math.floor(Math.random() * this.#TOTAL_OPTIONS);
            document.getElementById(i).style.order = randomPlace; // Order maintain the order of sibling elements in a div
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
        boxContainer.className = 'box-container-grid';
        board.appendChild(boxContainer);

        // Create the board
        for (let i=0; i<this.#TOTAL_OPTIONS; i++) {
            const box = document.createElement('div');
            box.classList.add('box', 'box-hovered');
            box.style.backgroundColor = '#ff0'; // Yellow background of buttons
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
                this.updatePlayerProgress(); // Unlock the next level
                this.stopActions();
                this.showInstruction('victory');
            }

            /* If gamescore hasn't been reached yet, rechoice the options.
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

        if (playerLevel == '4') {
            localStorage.setItem('playerLevel', 5);
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
            instructionMessage.innerHTML = 'You are really fast!';
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
            headings.innerHTML = 'Choose the SHORTEST or LONGEST word.'

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