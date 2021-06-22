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


main();


function computer_choice() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}


function getIconName(icon) {
    if (icon == 'r')
        return 'Rock';
    if (icon == 'p')
        return 'Paper';
    if (icon == 's')
        return 'Scissors';
}


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


function game (choice) {
    var player_choice = choice;
    var comp_choice = computer_choice();
    round_score += 1;
    round.innerHTML = round_score;
    
    switch (player_choice + comp_choice) {
        case 'rr':
        case 'ss':
        case 'pp':
        {
            result('draw', player_choice, comp_choice);
            break;
        }

        case 'rp':
        case 'sr':
        case 'ps':
        {
            result('lost', player_choice, comp_choice);
            break;
        }

        case 'rs':
        case 'sp':
        case 'pr':
        {
            result('win', player_choice, comp_choice);
            break;
        }
    }
}


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
