window.onload = function() {
    // Remove animations
    if (localStorage.getItem('animation')) {
        var h2 = document.getElementsByTagName('h2');
        var span = document.getElementsByTagName('span');

        // Remove animation of the Game name
        for (i = 0; i < h2.length; i++)
            h2[i].style.animation = 'none';

        // Instantly color 'C', 'A' & 'T'
        for (let i=0; i<span.length; i++)
            span[i].style.color = 'red';

        // Remove animation from the buttons
        document.querySelector('.content').style.animation = 'none';

        // Remove animation from the image
        document.querySelector('img').style.animation = 'none';
    }

    else {
        // Animation is shown only once (when the game reloads for the first time)
        localStorage.setItem('animation', 'true');
        var promise = document.getElementById('my_audio').play();

        if (promise !== undefined) {
            promise.then(_ => {
                console.log('Autoplay started');
            }).catch(error => {
                console.log('Autoplay Prevented!');
            });
        }

        setTimeout(function() {
            var spanEls = document.getElementsByTagName('span');
        
            for (let i=0; i<spanEls.length; i++)
                spanEls[i].style.color = 'red';
        }, 2000);
    }
}