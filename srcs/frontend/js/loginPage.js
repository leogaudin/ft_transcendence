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
        popUp();
        document.getElementById("visual-div").style.opacity = "0.5";
    });
    resetPassword.addEventListener("click", function (event) {
        if (event.target.classList.contains("close-icon")) {
            document.getElementById("visual-div").style.opacity = "1";
            resetPassword.style.display = "none";
            resetPassword.close();
        }
    });
});

function popUp() {
    resetPassword.style.display = "flex";
    resetPassword.showModal();
}

const toastAlert = document.getElementById("toast-default");
const toastText = document.getElementById("toast-message");
document.addEventListener("DOMContentLoaded", () =>{
    toastAlert.addEventListener("click", function (event) {
        if (event.target.classList.contains("close-icon")) {
            toastAlert.style.display = "none";
        }
    });
});

function showAlert(msg) {
    toastText.innerText = msg;
    toastAlert.style.display = "flex";
}



async function fetchDisplayTerms() {
    try {
        const response = await fetch(`./privacy-policy.html`);
        const content = await response.text();
        const sectionCondition = document.querySelector("#privacy-policy");
        sectionCondition.innerHTML = content;
    }
    catch (error) {
        console.error(`Error during fetch in ${method} ${endpoint}:`, error);
        return false;
    }
}


document.addEventListener("DOMContentLoaded", async function() {
    const termsButton = document.querySelector("#terms-conditions-button");
    const termsPage = document.querySelector("#terms-and-conditions");
    await fetchDisplayTerms();
    termsButton.addEventListener("click", () => {
        if (!termsPage.style.display || termsPage.style.display === "none") {
            signInPage.style.display = "none";
            signUpPage.style.display = "none";
            termsPage.style.display = "flex";
            termsButton.innerText = "Sign In";
        }
        else {
            signInPage.style.display = "flex";
            termsPage.style.display = "none";
            termsButton.innerText = "Privacy and Terms Conditions";
        }
    })
  });