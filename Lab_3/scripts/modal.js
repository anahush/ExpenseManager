window.onload = function () {
    var modalDescription = document.getElementById("transactionModal");
    var modalAdd = document.getElementById("addToGoalsModal");
    var linksModalDescription = document.getElementsByClassName("open-modal");
    var linksModalAdd = document.getElementsByClassName("open-modal-add");
    var spanDescription = document.getElementsByClassName("close-modal")[0];
    var spanAdd = document.getElementsByClassName("close-modal-add")[0];

    function openDescription() {
        modalDescription.style.display = "block";
    }

    for (var i = 0; i < linksModalDescription.length; i++) {
        linksModalDescription[i].onclick = openDescription;
    }

    spanDescription.onclick = function () {
        modalDescription.style.display = "none";
    }

    if (modalAdd != null && linksModalAdd.length != 0 && spanAdd != null) {
        function openAdd() {
            modalAdd.style.display = "block";
        }
        for (var i = 0; i < linksModalAdd.length; i++) {
            linksModalAdd[i].onclick = openAdd;
        }
        spanAdd.onclick = function () {
            modalAdd.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modalDescription) {
                modalDescription.style.display = "none";
            }
            if (event.target == modalAdd) {
                modalAdd.style.display = "none";
            }
        }
    } else {
        window.onclick = function (event) {
            if (event.target == modalDescription) {
                modalDescription.style.display = "none";
            }
        }
    }
}
