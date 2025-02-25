"use strict";
const dropdownButton = document.getElementById("menu-button");
const dropdownOptions = document.getElementById("language-options");

document.addEventListener("DOMContentLoaded", () => {
    dropdownButton.addEventListener("click", () => {
        dropdownButton.focus();
    });
    dropdownButton.addEventListener("focus", () => {
        dropdownOptions.style.display = "block";
    });
    dropdownButton.addEventListener("blur", () => {
        dropdownOptions.style.display = "none";
    });
    dropdownOptions.addEventListener("mousedown", (e) => {
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
    dropdownButton.innerText = language.label;
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

const resetPassButton = document.getElementById("forgot-password");
const resetPassword = document.getElementById("reset-password");

document.addEventListener("DOMContentLoaded", () =>{
    resetPassButton.addEventListener("click", () => {
        Popup();
    });
    resetPassword.addEventListener("click", () => {
        resetPassword.close();
    });
});

function Popup() {
    var myDialog = document.getElementById("reset-password");
    myDialog.showModal();
}
