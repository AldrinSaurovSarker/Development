function playStage(CurrentStage) {
    var gameInstance;

    if (CurrentStage == 1)
        gameInstance = new findValueGame(width=10, height=10, gridLength='45px', gridGap='5px', timeOut=10000, totalStage=4);
    if (CurrentStage == 2)
        gameInstance = new tapBoxGame(boardLength='500px', gridGap='25px', timeOut=10000, gameScore=8);
    if (CurrentStage == 3)
        gameInstance = new differentiateColorGame(width=5, height=6, gridLength='90px', gridGap='5px', timeOut=5000, totalStage=5);
    if (CurrentStage == 4)
        gameInstance = new wordLengthGame(boardLength='500px', gridGap='25px', timeOut=15000,  gameScore=6);
    if (CurrentStage == 5)
        gameInstance = new shapeAndColorGame(boardLength='500px', gridGap='25px', timeOut=15000,  gameScore=6);
    if (CurrentStage == 6)
        gameInstance = new colorOrderGame(width=4, height=4, gridLength='100px', gridGap='5px', timeOut=20000);
    if (CurrentStage == 7)
        gameInstance = new dayFinderGame(boardLength='500px', gridGap='25px', timeOut=20000,  gameScore=3);

    gameInstance.gameloop();
}


function playNextStage() {
    localStorage.setItem('CurrentStage', Number(localStorage.getItem('CurrentStage')) + 1);
    location.reload();
}



window.onload = function() {
    var CurrentStage = localStorage.getItem('CurrentStage');
    playStage(CurrentStage);
}