timeForStar = { // In seconds
    // STRUCTURE
    // Level no. {
    //     '1 star': t1, get time => t1 for 1 star
    //     '3 star': t2, get time <= t2 for 3 star 
    // }
    
    1: {
        '1 star': 30,
        '3 star': 20
    },

    2: {
        '1 star': 9,
        '3 star': 7
    },

    3: {
        '1 star': 20,
        '3 star': 15
    },

    4: {
        '1 star': 13,
        '3 star': 10
    },

    5: {
        '1 star': 27,
        '3 star': 18
    },

    6: {
        '1 star': 35,
        '3 star': 25
    },

    7: {
        '1 star': 55,
        '3 star': 45
    },
}


function calculateStar(time) { // in miliseconds unit
    const currentLevel = Number(localStorage.getItem('CurrentStage'));
    const str = 'level ' + currentLevel + ' star';
    const prevBest = Number(localStorage.getItem(str));
    var star;

    time = time/1000; // Converted to seconds
    console.log('Game time : ' + time);

    // Assign stars in localStorage
    if (time >= timeForStar[currentLevel]['1 star']) {    
        star = 1;

        if (prevBest < 2)
            localStorage.setItem(str, star);
    }

    else if (time <= timeForStar[currentLevel]['3 star']) {
        star = 3;
        localStorage.setItem(str, star);
    }
        
    else if (time > timeForStar[currentLevel]['3 star'] && time < timeForStar[currentLevel]['1 star']) {
        star = 2;
        if (prevBest != 3) {
            localStorage.setItem(str, star);
        }
    }
    
    return star;
}
