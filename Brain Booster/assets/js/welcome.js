window.onload = () => {
    var name = localStorage.getItem('player name');
    var playButton = document.querySelector('.play');

    playButton.style.pointerEvents = 'none';

    if (name) {
        document.querySelector('.form').style.display = 'none';
        document.getElementById('name').innerHTML = name;

        document.body.onclick = () => {
            document.querySelector('.welcome').classList.add('fade');
            playButton.style.pointerEvents = 'auto';
        }
    }

    else {
        document.querySelector('.form').style.display = 'block';
    }
}


function takeName() {
    const name = document.getElementById('name-field').value;
    var playButton = document.querySelector('.play');

    document.querySelector('.welcome').classList.add('fade');
    localStorage.setItem('player name', name);
    playButton.style.pointerEvents = 'auto';
}