const statButtons = document.querySelectorAll('.statButton');
const resetButtons = document.querySelectorAll('.resetButton');
const statPop = document.querySelector('.stat');
const section = document.querySelector('section');

const difficulty = ['beginner', 'intermediate', 'expert', 'custom'];
const features = ['best', 'win', 'lost', 'ratio'];


// Update game statistics on gameover
export function updateStatistics(diff, status, time) {
    // Update number of victory & defeat
    localStorage.setItem(diff + ' ' + status, 1 + Number(localStorage.getItem(diff + ' ' + status)));

    // Update best time only when game is won
    if (status == 'win') {
        if (Number(localStorage.getItem(diff + ' best'))) {
            if (Number(localStorage.getItem(diff + ' best') > time))
                localStorage.setItem(diff + ' best', time);
        }  
        else
            localStorage.setItem(diff + ' best', time);
    }
}


// Get ratio of two numbers
function getRatio(w, l) {
    w = Number(w);
    l = Number(l);

    if (w == 0)
        return (0).toFixed(2);
    if (l == 0)
        return (100).toFixed(2);
    return ((w * 100)/(w + l)).toFixed(2);
}


// Update ratio
function updateRatio(diff) {
    var ratio = getRatio(
        localStorage.getItem(diff + ' win'),
        localStorage.getItem(diff + ' lost')
    );
    localStorage.setItem(diff + ' ratio', ratio);
}


// Display popup for statistics
function displayStatPop() {
    if (section.classList.contains('blurred')) {
        statPop.style.visibility = 'hidden';
        section.classList.remove('blurred');
    }

    else {
        statPop.style.visibility = 'visible';
        section.classList.add('blurred');
    }
}


// Reset statistics
function resetStat() {
    for (let i=0; i<difficulty.length; i++) {
        for (let j=0; j<features.length; j++) {
            localStorage.removeItem(difficulty[i] + ' ' + features[j]);
        }
    }

    // Refresh need to see the changes
    localStorage.setItem('Reset', 'true');
    location.reload();
}


// Reset statistics popup
function resetStatPop() {
    const pop = document.querySelector('.statReset');

    if (pop.style.visibility == 'visible') {
        pop.style.visibility = 'hidden';
        statPop.style.visibility = 'visible';
    }

    else {
        pop.style.visibility = 'visible';
        statPop.style.visibility = 'hidden';
    }
}


window.addEventListener('load', function() {
    statButtons.forEach(btn => btn.addEventListener('click', displayStatPop));
    resetButtons.forEach(btn => btn.addEventListener('click', resetStatPop));

    document.querySelector('.reset').addEventListener('click', function() {
        resetStat();
    });

    // If local storage has just been reset, STAT popup will be visible after page loads
    if (localStorage.getItem('Reset') == 'true') {
        document.getElementById('stat').click();
        localStorage.setItem('Reset', 'false');
    }

    // Update ratio
    for (let i=0; i<difficulty.length; i++) {
        updateRatio(difficulty[i]);
    }

    // Update statistics
    for (let i=0; i<difficulty.length; i++) {
        for (let j=0; j<features.length; j++) {
            var item = localStorage.getItem(difficulty[i] + ' ' + features[j]);

            if (item)
                document.getElementById(difficulty[i] + '-' + features[j]).innerHTML = item;
            else
                document.getElementById(difficulty[i] + '-' + features[j]).innerHTML = '0';
        }
    }
});