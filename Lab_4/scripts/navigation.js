function hamburgerOpenClose() {
    var topNav = document.getElementById("myTopnav");
    if (topNav) {
        topNav.classList.toggle('responsive');
    }
}

function hamburgerOnlyClose() {
    var topNav = document.getElementById("myTopnav");
    topNav.className = "nav-wrapper";
}