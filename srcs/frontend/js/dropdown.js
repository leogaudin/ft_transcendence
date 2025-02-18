"use strict";
const button = document.getElementById("menu-button");
const dropdown = document.getElementById("language-options");

document.addEventListener("DOMContentLoaded", () => {
    button.addEventListener("click", () => {
        button.focus();
    });
    button.addEventListener("focus", () => {
        dropdown.style.display = "block";
    });
    button.addEventListener("blur", () => {
        dropdown.style.display = "none";
    });
    dropdown.addEventListener("mousedown", (e) => {
        const key = e.target.getAttribute('language_key');
        changeLanguage(key);
    });
});

function changeLanguage(option) {
    const languages = [
        { key: 'es', label: 'Español' },
        { key: 'en', label: 'English' },
        { key: 'fr', label: 'Français' },
    ];

    const language = languages.find((elem) => elem.key == option);
    button.innerText = language.label;
}
