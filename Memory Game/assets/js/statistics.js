window.onload = () => {
    // If local storage has just been reset, STAT popup will be visible after page loads
    if (localStorage.getItem('hasBeenReset') == 'true') {
        document.getElementById('stat').click();
        localStorage.setItem('hasBeenReset', 'false');
    }

    // Total Match statistics
    const diff = ['easy', 'medium', 'hard'];

    // ALL
    document.getElementById('total').innerHTML = sum([
        Number(localStorage.getItem('easy match total')),
        Number(localStorage.getItem('medium match total')),
        Number(localStorage.getItem('hard match total'))
    ]);

    document.getElementById('completed').innerHTML = sum([
        Number(localStorage.getItem('easy match completed')),
        Number(localStorage.getItem('medium match completed')),
        Number(localStorage.getItem('hard match completed'))
    ]);

    document.getElementById('abandoned').innerHTML = sum([
        Number(localStorage.getItem('easy match abandoned')),
        Number(localStorage.getItem('medium match abandoned')),
        Number(localStorage.getItem('hard match abandoned'))
    ]);

    for (let i=0; i<diff.length; i++) {
        // TOTAL
        if (localStorage.getItem(diff[i] + ' match total'))
            document.getElementById(diff[i] + '-total').innerHTML = localStorage.getItem(diff[i] + ' match total');
        else
            document.getElementById(diff[i] + '-total').innerHTML = '0';

        // COMPLETED
        if (localStorage.getItem(diff[i] + ' match completed'))
            document.getElementById(diff[i] + '-completed').innerHTML = localStorage.getItem(diff[i] + ' match completed');
        else
            document.getElementById(diff[i] + '-completed').innerHTML = '0';

        // ABANDONED
        if (localStorage.getItem(diff[i] + ' match abandoned'))
            document.getElementById(diff[i] + '-abandoned').innerHTML = localStorage.getItem(diff[i] + ' match abandoned');
        else
            document.getElementById(diff[i] + '-abandoned').innerHTML = '0';
    }

    // Show the best times for different difficulty level
    // EASY
    if (localStorage.getItem('easy best time'))
        document.querySelectorAll('.ebt').forEach(ebt => ebt.innerHTML = convertedTime(Number(localStorage.getItem('easy best time'))) + 's');
    else
        document.querySelectorAll('.ebt').forEach(ebt => ebt.innerHTML = '-:-');

    // MEDIUM
    if (localStorage.getItem('medium best time'))
        document.querySelectorAll('.mbt').forEach(mbt => mbt.innerHTML = convertedTime(Number(localStorage.getItem('medium best time'))) + 's');
    else
        document.querySelectorAll('.mbt').forEach(mbt => mbt.innerHTML = '-:-');

    // HARD
    if (localStorage.getItem('hard best time'))
        document.querySelectorAll('.hbt').forEach(hbt => hbt.innerHTML = convertedTime(Number(localStorage.getItem('hard best time'))) + 's');
    else
        document.querySelectorAll('.hbt').forEach(hbt => hbt.innerHTML = '-:-');
    
    // Show the flip informations
    // ALL
    document.getElementById('tf').innerHTML = sum([
        Number(localStorage.getItem('easy total flips')),
        Number(localStorage.getItem('medium total flips')),
        Number(localStorage.getItem('hard total flips'))]
    );

    document.getElementById('mf').innerHTML = sum([
        Number(localStorage.getItem('easy matched flips')),
        Number(localStorage.getItem('medium matched flips')),
        Number(localStorage.getItem('hard matched flips'))]
    );

    document.getElementById('wf').innerHTML = sum([
        Number(localStorage.getItem('easy wrong flips')),
        Number(localStorage.getItem('medium wrong flips')),
        Number(localStorage.getItem('hard wrong flips'))]
    );

    // EASY
    if (localStorage.getItem('easy total flips'))
        document.getElementById('etf').innerHTML = localStorage.getItem('easy total flips');
    else
        document.getElementById('etf').innerHTML = '0';

    if (localStorage.getItem('easy matched flips'))
        document.getElementById('emf').innerHTML = localStorage.getItem('easy matched flips');
    else
        document.getElementById('emf').innerHTML = '0';

    if (localStorage.getItem('easy wrong flips'))
        document.getElementById('ewf').innerHTML = localStorage.getItem('easy wrong flips');
    else
        document.getElementById('ewf').innerHTML = '0';

    // MEDIUM
    if (localStorage.getItem('medium total flips'))
        document.getElementById('mtf').innerHTML = localStorage.getItem('medium total flips');
    else
        document.getElementById('mtf').innerHTML = '0';

    if (localStorage.getItem('medium matched flips'))
        document.getElementById('mmf').innerHTML = localStorage.getItem('medium matched flips');
    else
        document.getElementById('mmf').innerHTML = '0';

    if (localStorage.getItem('medium wrong flips'))
        document.getElementById('mwf').innerHTML = localStorage.getItem('medium wrong flips');
    else
        document.getElementById('mwf').innerHTML = '0';

    // HARD
    if (localStorage.getItem('hard total flips'))
        document.getElementById('htf').innerHTML = localStorage.getItem('hard total flips');
    else
        document.getElementById('htf').innerHTML = '0';

    if (localStorage.getItem('hard matched flips'))
        document.getElementById('hmf').innerHTML = localStorage.getItem('hard matched flips');
    else
        document.getElementById('hmf').innerHTML = '0';

    if (localStorage.getItem('hard wrong flips'))
        document.getElementById('hwf').innerHTML = localStorage.getItem('hard wrong flips');
    else
        document.getElementById('hwf').innerHTML = '0';
}


// Takes second as param and return in M:S format
function convertedTime(seconds) {
    return Math.floor(seconds / 60) + ':' + (seconds % 60 < 10 ? '0' : '') + (seconds % 60);
}


// Sum an array (excludes NULL)
function sum(arr) {
    var s = 0;

    for (var i of arr) {
        if (i != null)
            s += i;
    }
    return s;
}


// Delete all data from local storage & Refresh the page to see updated data instantly
function resetStorage() {
    localStorage.clear();
    localStorage.setItem('hasBeenReset', 'true');
    location.reload();
}


// Confirm reset popup
function confirmReset() {
    clickSound.play();

    const stat = document.querySelector('.stat');
    const resetStat = document.querySelector('.resetStat');

    if (stat.style.visibility == 'visible') {
        stat.style.visibility = 'hidden';
        resetStat.style.visibility = 'visible';
    }

    else {
        stat.style.visibility = 'visible';
        resetStat.style.visibility = 'hidden';
    }
}


// Reset data popup
document.querySelectorAll('.clear').forEach(btn => btn.addEventListener('click', function() {
    confirmReset();
}));
