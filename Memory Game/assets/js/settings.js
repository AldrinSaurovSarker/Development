/* Audio settings */
const soundOn = document.getElementById('sound-on');
const soundOff = document.getElementById('sound-off');
const musicOn = document.getElementById('music-on');
const musicOff = document.getElementById('music-off');

/* Dark mode toggler */
var el = document.getElementById('toggler');

var soundMuted = false, musicMuted = false;

/* Turn Sound on/off */
function toggleSound() {
    if (!soundMuted) {
        soundMuted = true;
        soundOn.style.visibility = 'hidden';
        soundOff.style.visibility = 'visible';
    }

    else {
        soundMuted = false;
        soundOff.style.visibility = 'hidden';
        soundOn.style.visibility = 'visible';
    }
}

soundOn.addEventListener('click', function() {
    toggleSound();
});

soundOff.addEventListener('click', function() {
    toggleSound();
});

/* Turn Music on/off */
function toggleMusic() {
    if (!musicMuted) {
        musicMuted = true;
        bgMusic.volume = 0;
        musicOn.style.visibility = 'hidden';
        musicOff.style.visibility = 'visible';
    }

    else {
        musicMuted = false;
        bgMusic.volume = 0.5;
        musicOff.style.visibility = 'hidden';
        musicOn.style.visibility = 'visible';
    }
}

musicOn.addEventListener('click', function() {
    toggleMusic();
});

musicOff.addEventListener('click', function() {
    toggleMusic();
});

/* Exit game */
document.getElementsByTagName('button')[0].addEventListener('click', function() {
    location.href = "memory-game.html";
});

/* Toggle Dark mode */
el.addEventListener('click', function() {
    document.body.classList.toggle('dark');
});

/* Functionalities of keyboard keys */
/* [M] Mute Music */
/* [S] Mute Sound */
$(document).ready(function() {
    $(document).on('keypress', function(e) {
        if (e.which == 109) { // On pressing 'M'
            toggleMusic();
        }

        if (e.which == 115) { // On pressing 'S'
            toggleSound();
        }
    })
});
