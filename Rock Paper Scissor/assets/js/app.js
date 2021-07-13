let user_score = 0;
let comp_score = 0;
let draw_score = 0;
let round_score = 0;

const user_score_el = document.getElementById('user-score');
const comp_score_el = document.getElementById('comp-score');
const draw_score_el = document.getElementById('ties-score');

const round = document.getElementById('round');
const rock = document.getElementById('r');
const paper = document.getElementById('p');
const scissors = document.getElementById('s');

const results = document.getElementById('result');
const details = document.getElementById('details');

const symbols = ['r', 'p', 's'];
const imageRelativePath = 'assets/images'


main();


// Randomly select an icon
function computer_choice() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}


// Return icon fullname from short name
function getIconName(icon) {
    if (icon == 'r')
        return 'Rock';
    if (icon == 'p')
        return 'Paper';
    if (icon == 's')
        return 'Scissors';
}


// Result / Updating score-board and message
function result(msg, pc, cc) {
    if (msg == 'win') {
        user_score += 1;
        user_score_el.innerHTML =  user_score;
        results.innerHTML = 'You Won!';
        results.style.color = 'lime';
        details.innerHTML = getIconName(pc) + ' beats ' + getIconName(cc);
    }

    if (msg == 'lost') {
        comp_score += 1;
        comp_score_el.innerHTML =  comp_score;
        results.innerHTML = 'You Lost!';
        results.style.color = 'red';
        details.innerHTML = getIconName(pc) + ' is beaten by ' + getIconName(cc);
    }

    if (msg == 'draw') {
        draw_score += 1;
        draw_score_el.innerHTML =  draw_score;
        results.innerHTML = 'Draw!';
        results.style.color = 'cyan';
        details.innerHTML = getIconName(pc) + ' matches ' + getIconName(cc);
    }
}


// Hand Shaking animation
function shakeAnimation(player, computer) {
    // FIST/ROCK will be shown while hand is being shaked
    document.querySelector('.user-hand').innerHTML = '<img src="' + imageRelativePath + '/rock.jpg" alt="rock">';
    document.querySelector('.comp-hand').innerHTML = '<img src="' + imageRelativePath + '/rock.jpg" alt="rock">';

    // Add animation class (duration: 1500 miliseconds)
    document.querySelector('.user-hand img').classList.add('shake-user');
    document.querySelector('.comp-hand img').classList.add('shake-comp');

    // Images for icons
    const images = {
        'r': '<img src="' + imageRelativePath + '/rock.jpg" alt="rock">',
        'p': '<img src="' + imageRelativePath + '/paper.jpg" alt="paper">',
        's': '<img src="' + imageRelativePath + '/scissor.jpg" alt="scissor">',
    }

    // Change image to the selected icon after 1500 miliseconds
    setTimeout(() => {
        document.querySelector('.user-hand').innerHTML = images[player];
        document.querySelector('.comp-hand').innerHTML = images[computer];
        document.querySelector('.user-hand img').classList.remove('shake-user');
        document.querySelector('.comp-hand img').classList.remove('shake-comp');
    }, 1500);
}


// Game decision according to user choice and computer choice
function game (choice) {
    var player_choice = choice;
    var comp_choice = computer_choice(); // Get random computer choice 
    round_score += 1;
    round.innerHTML = round_score;
    
    shakeAnimation(player_choice, comp_choice);

    // Update everything after 1500 miliseconds (animation duration)
    setTimeout(() => {
        switch (player_choice + comp_choice) {
            // Winning combination
            case 'rr':
            case 'ss':
            case 'pp':
            {
                result('draw', player_choice, comp_choice);
                break;
            }
    
            // Losing combination
            case 'rp':
            case 'sr':
            case 'ps':
            {
                result('lost', player_choice, comp_choice);
                break;
            }
    
            // Draw combination
            case 'rs':
            case 'sp':
            case 'pr':
            {
                result('win', player_choice, comp_choice);
                break;
            }
        }        
    }, 1500);
}


// Activity on clicking on icons
function main () {
    rock.addEventListener('click', function() {
        game('r');
    });
    
    paper.addEventListener('click', function() {
        game('p');
    });
    
    scissors.addEventListener('click', function() {
        game('s');
    });
}
