function hamburgerOpenClose() {
    var x = document.getElementById("myTopnav");
    if (x.className === "nav-wrapper") {
        x.className += " responsive";
    } else {
        x.className = "nav-wrapper";
    }
}

function hamburgerOnlyClose() {
    var x = document.getElementById("myTopnav");
    x.className = "nav-wrapper";
}