var number = document.querySelectorAll('.number');


// Change grid size tab
function openLevel(evt, level) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(level).style.display = "block";
    evt.currentTarget.className += " active";
}


// Prevent number input from entering negative sign
number.forEach(field => field.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
        return false;
    }
})


// By default, 'Beginner' difficulty is shown
document.getElementById("defaultOpen").click();
