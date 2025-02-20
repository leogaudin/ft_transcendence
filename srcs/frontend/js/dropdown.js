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

const signUpButton = document.getElementById("sign-up-button");
const signInButton = document.getElementById("sign-in-button");
const signUpPage = document.getElementById("sign-up-page");
const signInPage = document.getElementById("login-page");

document.addEventListener("DOMContentLoaded", () =>{
    signUpButton.addEventListener("click", () => {
        signInPage.style.display = "none";
        signUpPage.style.display = "flex";
    });
    signInButton.addEventListener("click", () => {
        signInPage.style.display = "flex";
        signUpPage.style.display = "none";
    });
});
