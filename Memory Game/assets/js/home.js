var el = document.getElementById('toggler');
var lvl = document.getElementById('levelSelect');
var pop = document.getElementById('cancel');
const selector = document.getElementById('selector')

const intro = document.querySelector('.intro');
const stat = document.querySelector('.stat');
const keyview = document.querySelector('.keyview');
const levelPop = document.querySelector('#pop');
const levels = document.querySelectorAll('.select-level');
const introBtn = document.querySelectorAll('.introBtn');
const statBtn = document.querySelectorAll('.statBtn');
const keyviewBtn = document.querySelectorAll('.keyviewBtn');

const clickSound = new Audio('assets/audio/flip.wav');


/* Disable activies when there in any popped screen */
function disableBackground() {
    document.body.style.pointerEvents = 'none';

    /* Popped screen should be clickable */
    intro.style.pointerEvents = 'auto';
    stat.style.pointerEvents = 'auto';
    keyview.style.pointerEvents = 'auto';
    levelPop.style.pointerEvents = 'auto';
    document.querySelector('.resetStat').style.pointerEvents = 'auto'
}


/* Enable activities when game is resumed */
function enableBackground() {
    document.body.style.pointerEvents = 'auto';
}


/* Display INTRODUCTION popup */
introBtn.forEach(btn => btn.addEventListener('click', function() {
    clickSound.play();

    if (selector.classList.contains('blurred')) {
        intro.style.visibility = 'hidden';
        selector.classList.remove('blurred');
        enableBackground();
    }

    else {
        intro.style.visibility = 'visible';
        selector.classList.add('blurred');
        disableBackground();
    }
}));


/* Display STATISTICS popup */
statBtn.forEach(btn => btn.addEventListener('click', function() {
    if (localStorage.getItem('hasBeenReset') == 'false') {
        clickSound.play();
    }

    if (selector.classList.contains('blurred')) {
        stat.style.visibility = 'hidden';
        selector.classList.remove('blurred');
        enableBackground();
    }

    else {
        stat.style.visibility = 'visible';
        selector.classList.add('blurred');
        disableBackground();
    }
}));


/* Display KEYBOARD SHORTCURTS popup */
keyviewBtn.forEach(btn => btn.addEventListener('click', function() {
    clickSound.play();

    if (selector.classList.contains('blurred')) {
        keyview.style.visibility = 'hidden';
        selector.classList.remove('blurred');
        enableBackground();
    }

    else {
        keyview.style.visibility = 'visible';
        selector.classList.add('blurred');
        disableBackground();
    }
}));


/* Display SELECT LEVEL popup */
lvl.addEventListener('click', function() {
    clickSound.play();
    disableBackground();
    document.getElementById('pop').style.visibility = 'visible';
    document.getElementById('selector').classList.add('blurred');
});


/* Cancel SELECT LEVEL popup */
pop.addEventListener('click', function() {
    clickSound.play();
    enableBackground();
    document.getElementById('pop').style.visibility = 'hidden';
    document.getElementById('selector').classList.remove('blurred');
});


/* Click sound on selecting level */
levels.forEach(level => level.addEventListener('click', function() {
    clickSound.play();
}));


/* Toggle DARK mode */
el.addEventListener('click', function() {
    document.body.classList.toggle('dark');
});
