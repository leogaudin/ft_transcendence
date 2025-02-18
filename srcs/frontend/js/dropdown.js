"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-button");
    const menuDropdown = document.getElementById("language-options");
        menuButton.addEventListener("click", () => {
            if (menuDropdown.style.display == "none" || !menuDropdown.style.display)
                menuDropdown.style.display = "block";
            else
                menuDropdown.style.display = "none";
        });
        // Cerrar el dropdown si se hace clic fuera de él
        // document.addEventListener("click", () => {
        //     if (menuDropdown.style.display == "block") {
        //         menuDropdown.style.display == "none";
        //     }
        // });
    // }
});
