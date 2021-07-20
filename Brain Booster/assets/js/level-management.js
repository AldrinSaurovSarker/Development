const NUMBER_OF_STAGES = 7;
var PLAYER_LEVEL = localStorage.getItem('playerLevel');

if (!PLAYER_LEVEL) {
    PLAYER_LEVEL = 1;
    localStorage.setItem('playerLevel', PLAYER_LEVEL);
}

for (let i=1; i<=NUMBER_OF_STAGES; i++) {
    const levelButton = document.getElementById(i);
    const stars = document.querySelector('.level-'+i).children;
    const bestStar = Number(localStorage.getItem('level ' + i + ' star'));

    // Color obtained stars in orange
    for (let j=0; j<stars.length; j++) {
        if (j < bestStar) {
            stars[j].style.color = '#ffa500';
        }
    }

    // Unlocked levels
    if (PLAYER_LEVEL >= i) {
        document.getElementById(i + 'L').classList.replace('locked', 'unlocked');
        levelButton.innerHTML = 'Start';
        levelButton.style.backgroundColor = '#e74c3c';
    }

    levelButton.addEventListener('click', function() {
        if (PLAYER_LEVEL >= i) {
            localStorage.setItem('CurrentStage', i);
            location.href = 'game.html';
        }
    });
}
