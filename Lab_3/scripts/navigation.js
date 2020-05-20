function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "nav-wrapper") {
        x.className += " responsive";
    } else {
        x.className = "nav-wrapper";
    }
}