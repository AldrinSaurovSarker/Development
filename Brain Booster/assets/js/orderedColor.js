class colorOrderGame {
    /* An array in this array contains 16 different shades in a color, darkest to lightest */
    #values = [
        // RED
        ['hsl(0, 100%, 6.25%)', 'hsl(0, 100%, 12.5%)', 'hsl(0, 100%, 18.75%)', 'hsl(0, 100%, 25%)',
        'hsl(0, 100%, 31.25%)', 'hsl(0, 100%, 37.5%)', 'hsl(0, 100%, 43.75%)', 'hsl(0, 100%, 50%)',
        'hsl(0, 100%, 56.25%)', 'hsl(0, 100%, 62.5%)', 'hsl(0, 100%, 68.75%)', 'hsl(0, 100%, 75%)',
        'hsl(0, 100%, 81.25%)', 'hsl(0, 100%, 87.5%)', 'hsl(0, 100%, 93.75%)', 'hsl(0, 100%, 100%)'
        ],

        // YELLOW
        ['hsl(60, 100%, 6%)', 'hsl(60, 100%, 12%)', 'hsl(60, 100%, 18%)', 'hsl(60, 100%, 24%)',
        'hsl(60, 100%, 30%)', 'hsl(60, 100%, 36%)', 'hsl(60, 100%, 42%)', 'hsl(60, 100%, 48%)',
        'hsl(60, 100%, 54%)', 'hsl(60, 100%, 60%)', 'hsl(60, 100%, 66%)', 'hsl(60, 100%, 72%)',
        'hsl(60, 100%, 76%)', 'hsl(60, 100%, 80%)', 'hsl(60, 100%, 90%)', 'hsl(60, 100%, 100%)'
        ],

        // GREEN
        ['hsl(120, 100%, 6%)', 'hsl(120, 100%, 12%)', 'hsl(120, 100%, 18%)', 'hsl(120, 100%, 24%)',
        'hsl(120, 100%, 30%)', 'hsl(120, 100%, 36%)', 'hsl(120, 100%, 42%)', 'hsl(120, 100%, 48%)',
        'hsl(120, 100%, 54%)', 'hsl(120, 100%, 60%)', 'hsl(120, 100%, 66%)', 'hsl(120, 100%, 72%)',
        'hsl(120, 100%, 76%)', 'hsl(120, 100%, 80%)', 'hsl(120, 100%, 90%)', 'hsl(120, 100%, 100%)'
        ],

        // BLUE
        ['hsl(240, 100%, 6.25%)', 'hsl(240, 100%, 12.5%)', 'hsl(240, 100%, 18.75%)', 'hsl(240, 100%, 25%)',
        'hsl(240, 100%, 31.25%)', 'hsl(240, 100%, 37.5%)', 'hsl(240, 100%, 43.75%)', 'hsl(240, 100%, 50%)',
        'hsl(240, 100%, 56.25%)', 'hsl(240, 100%, 62.5%)', 'hsl(240, 100%, 68.75%)', 'hsl(240, 100%, 75%)',
        'hsl(240, 100%, 81.25%)', 'hsl(240, 100%, 87.5%)', 'hsl(240, 100%, 93.75%)', 'hsl(240, 100%, 100%)'
        ]
    ];

    #timeTotal; // width of the timer div
    #timeElasped = 0; // For increasing line timer width
    #totalElaspedTime = 0;

    #counterLine; // For line timer
    #playerClicks = 0; // To check if player is clicking in the right order
    #currentStage = 1; // stage1: light to dark, stage2: dark to light
    #totalStage = 2; // Number of stages


    /* Constructor */
    constructor(width=10, height=10, gridLength='45px', gridGap='5px', timeOut=10000) {
        this.width = width; // Number of square in a row
        this.height = height; // Number of square in a column
        this.gridLength = gridLength; // length of each square
        this.gridGap = gridGap; // Gap between each squares
        this.timeOut = timeOut; // Time for answer a question (miliseconds)

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


    /* Set game properties */
    randomizeBoard() {
        this.randomColorSet = this.getRandomValue(this.#values.length);
    }


    // Shuffle Colors
    shuffleColors() {
        var loop = this.width * this.height; // Total number of color blocks

        for (let i=0; i<loop; i++) {
            var randomPlace = Math.floor(Math.random() * loop);
            document.getElementById(i).style.order = randomPlace;

            // Remove fade element (a block fades away after been clicked)
            document.getElementById(i).classList.remove('fade');
        }
    }


    // Put values in instruction box and game board
    putValues() {
        // Choose a colorset at the first round and use the same color in the second round
        if (this.#currentStage == 1)
            this.randomizeBoard();
    
        // introduction box
        document.querySelector('.introduction').innerHTML = 'Choose the colors from ' +
        (this.#currentStage == 1 ? 'lightest to darkest' : 'darkest to lightest');

        // Create the board    
        for (let i=0; i<this.width * this.height; i++) {
            // For multiple levels, reset properties that could have been changed in the last level
            const square = document.getElementById(i); 
            square.style.border = 'none';
            square.style.pointerEvents = 'auto';
            square.style.backgroundColor = this.#values[this.randomColorSet][i];
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
        for (let i=0; i<this.height * this.width; i++) {
            document.getElementById(i).style.pointerEvents = 'none';
        }
    }


    // Defeat in game
    gameover(res, id=null) {
        if (res == 'victory') {
            this.#playerClicks++;
            document.getElementById(id).classList.add('fade'); // fades after click

            if (this.#playerClicks == this.height * this.width) { // If all boxes are clicked
                if (this.#currentStage == 1) {
                    this.#currentStage++; // Go to next stage
                    this.#playerClicks = 0;
                    this.stopActions();
                    this.showInstruction();
                }

                else {
                    this.updatePlayerProgress(); // Unlock the next level
                    this.stopActions();
                    this.showInstruction('victory');
                }
            }
        }
            
        else {
            this.stopActions();
            var correctBlockId;

            if (this.#currentStage == 1)
                correctBlockId = this.height * this.width - this.#playerClicks - 1;
            else
                correctBlockId = this.#playerClicks;

            if (correctBlockId < 7)
                document.getElementById(correctBlockId).innerHTML = '<h6 class="text-center text-light">I was next</h6>';
            else
                document.getElementById(correctBlockId).innerHTML = '<h6 class="text-center text-dark">I was next</h6>';

            if (id != null) {
                if (id < 7)
                    document.getElementById(id).innerHTML = '<h6 class="text-center text-light">You clicked me</h6>';
                else
                    document.getElementById(id).innerHTML = '<h6 class="text-center text-dark">You clicked me</h6>';
                console.log('Huh>?');

                setTimeout(() => { // SetTimeout to make sure the innerHTML property work first before alert
                    this.showInstruction('defeat misclick');
                }, 3000);
            }
            else {
                setTimeout(() => { // SetTimeout to make sure the innerHTML property work first before alert
                    this.showInstruction('defeat timeout');
                }, 3000);
            }
        }
    }


    // Increase player level
    updatePlayerProgress() {
        const playerLevel = localStorage.getItem('playerLevel');
    
        if (playerLevel == '6') {
            localStorage.setItem('playerLevel', 7);
        }
    }


    // Check for correct/wrong click
    checkPlayerMove(id) {
        // If this is LIGHT TO DARK stage
        if (this.#currentStage == 1) {
            if (id + this.#playerClicks == this.height * this.width - 1)
                this.gameover('victory', id);
            else
                this.gameover('defeat', id);
        }

        // If this is DARK TO LIGHT stage
        else {
            if (id == this.#playerClicks)
                this.gameover('victory', id);
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
        var self = this;
        for (let i=0; i<this.width * this.height; i++) {
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
            instructionMessage.innerHTML = 'You should choose in the correct order';
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
            headings.innerHTML = 'Round ' + this.#currentStage + ' of ' + this.#totalStage;
            
            if (this.#currentStage == 1)
                instructionMessage.innerHTML = 'Choose the colors from LIGHTEST to DARKEST';
            else
                instructionMessage.innerHTML = 'Choose the colors again.<br>But from DARKEST to LIGHTEST this time';

            continueBtn.addEventListener('click', function() {
                if (gameWindow.style.display == 'none') {
                    gameWindow.style.display = 'block';
                    instructionWindow.style.display = 'none';
                    
                    self.playStage();
                }
            });
        }
    }


    playStage() {
        this.setTimerProperties();
        this.startTimerLine(this.#timeTotal);
        this.putValues();

        // Shuffle colors randomly
        this.shuffleColors();
    }


    // Game
    gameloop() {
        this.createBoard();
        this.showInstruction();
        this.playerAction(); 
    }
}