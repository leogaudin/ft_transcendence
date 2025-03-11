"use strict";

export function initLoginEvents() {
    dropDown();
    switchSigns();
    resetPassword();
    displayToast();
    displayTerms();
    
    // handleCredentialResponse();
}

function dropDown(){
    const dropdownButton = document.getElementById("menu-button");
    const dropdownOptions = document.getElementById("language-options");
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
}

function changeLanguage(option) {
    const dropdownButton = document.getElementById("menu-button");
    const languages = [
        { key: 'es', label: 'Español' },
        { key: 'en', label: 'English' },
        { key: 'fr', label: 'Français' },
    ];

    const language = languages.find((elem) => elem.key == option);
    if (!language || language === undefined)
        dropdownButton.innerText = "English";
    else
        dropdownButton.innerText = language.label;
}


function switchSigns() {
    const signUpButton = document.getElementById("sign-up-button");
    const signInButton = document.getElementById("sign-in-button");
    const signUpPage = document.getElementById("sign-up-page");
    const signInPage = document.getElementById("login-page");
    signUpButton.addEventListener("click", () => {
        signInPage.style.display = "none";
        signUpPage.style.display = "flex";
    });
    signInButton.addEventListener("click", () => {
        signInPage.style.display = "flex";
        signUpPage.style.display = "none";
    });
}


function resetPassword() {
    const resetPassButton = document.getElementById("forgot-password");
    const resetPassword = document.getElementById("recover-password");
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
}

function popUp() {
    const resetPassword = document.getElementById("recover-password");
    resetPassword.style.display = "flex";
    resetPassword.showModal();
}

function displayToast() {
    const toastAlert = document.getElementById("toast-default");
    toastAlert.addEventListener("click", function (event) {
        if (event.target.classList.contains("close-icon")) {
            toastAlert.style.display = "none";
        }
    });
}

export function showAlert(msg) {
    const toastText = document.getElementById("toast-message");
    const toastAlert = document.getElementById("toast-default");
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


async function displayTerms() {
    const signUpPage = document.getElementById("sign-up-page");
    const signInPage = document.getElementById("login-page");
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
}