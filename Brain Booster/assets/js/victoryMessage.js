victoryMessageList = {
    // STRUCTURE
    // Level no. {
    //     '3 star': t1,
    //     '2 star': 
    //     '1 star': 
    // }
    
    1: {
        3: 'You have eagle eyes!',
	    2: 'You have a good eye!',
	    1: 'You can do better!'
    },

    2: {
        3: 'You are fast like a rocket.',
	    2: 'You are really fast',
	    1: 'Play quicker to gain more stars.'
    },

    3: {
        3: 'You have eagle eyes!',
	    2: 'You have a good eye!',
	    1: 'You can do better!'
    },

    4: {
        3: 'I knew you are an expert in English.',
        2: 'You are really fast!',
        1: 'You can be faster.'
    },

    5: {
        3: "Your iq is above 140 i'm sure.",
        2: 'Your logic is amazing.',
        1: 'Think faster to gain more stars.'
    },

    6: {
        3: 'You have eagle eyes!',
	    2: 'You have a good eye!',
	    1: 'You can do better!'
    },

    7: {
        3: 'Your logic is like Sherlok Homes!',
	    2: 'Your logic is amazing!',
	    1: 'Think faster to gain more stars.'
    },
}


function victoryMessage(star) {
    const currentLevel = Number(localStorage.getItem('CurrentStage'));
    return victoryMessageList[currentLevel][star];
}
