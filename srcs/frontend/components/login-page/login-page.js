"use strict";

import { initLoginFetches } from "./login-fetch.js"

export function initLoginEvents() {
	dropDown();
	switchSigns();
	resetPassword();
	initLoginFetches();
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




