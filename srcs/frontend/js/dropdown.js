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


const signupSubmit = document.getElementById("signup-form");

async function handleRegister() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    try {
        if (!username || !email || !password || !confirmPassword)
            throw new Error("Fill in all the fields");
        if (password !== confirmPassword)
            throw new Error("Passwords don't match");
        if (password.length < 9)
            throw new Error("Password too short");
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password))
            throw new Error("Please use at least one uppercase, lowercase, number and '*.-_'");
    }
    catch (error) {
        console.error(`Error: `, error);
        return false;
    }
    // Mirar tipo de email, largo, etc
    const response = await sendRequest('POST', 'register', {username: username, email: email, password: password, confirm_password: confirmPassword});
    if (response["error"]) {
        if (response["error"].includes("username"))
            alert("Email duplicado");
        else if (response["error"].includes("email"))
            alert("Error en el usuario");
        else if (response["error"].includes("password"))
            alert("Error en la contraseña");
        else
            alert(response["error"]);
        console.log(response);
    }
    else {
        alert("Chuli");
    }
}

signupSubmit.addEventListener("submit", handleRegister);

async function sendRequest(method, endpoint, body = null) {
    try {
        const response = await fetch(`http://localhost:9000/${endpoint}`, {
            method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        });
        return await response.json();
    }
    catch (error) {
        console.error(`Error en ${method} ${endpoint}:`, error);
        return false;
    }
}