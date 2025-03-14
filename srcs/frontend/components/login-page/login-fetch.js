"use strict";

import { showAlert } from "../toast-alert/toast-alert.js";
import { navigateTo } from "../../router.js";
import { twoFactorAuth } from "../two-factor-page/two-factor.js"

export function initLoginFetches() {
	const signupSubmit = document.getElementById("signup-form");
	const loginSubmit = document.getElementById("login-form");
	const recoverPasswordSubmit = document.getElementById("recover-password-form");
	signupSubmit.addEventListener("submit", handleRegister);
	loginSubmit.addEventListener("submit", handleLogin);
	recoverPasswordSubmit.addEventListener("submit", recoverPassword);
	displayTerms();
}


export function parseSessionForm(username, password, email = "Default", confirmPassword = password) {
	let msg = "Ok";

	if (!username || !email || !password || !confirmPassword)
		msg = "Fill in all the fields";
	else if (email !== "Default") {
		if (username.length < 4)
			msg = "Username too short";
		else if (!/^[a-z0-9]+$/gi.test(username))
			msg = "Username can only contain lowercase and digits";
		else if (password !== confirmPassword)
			msg = "Passwords don't match";
		else if (password.length < 9)
			msg = "Password too short";
		else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[*\.\-_]/.test(password))
			msg = "Please use at least one uppercase, lowercase, number and '*.-_'";
	}

	return (msg);
}

async function handleLogin(e) {
	e.preventDefault();
	const username = document.getElementById("login-username").value;
	const password = document.getElementById("password").value;
	document.getElementById("login-form").reset();

	try {
		const msg = parseSessionForm(username, password);
		if (msg !== "Ok")
			throw new Error(msg);
		
		const response = await sendRequest('POST', 'login', {username: username, password: password});
		if (!response["id"]) {
			if (response["twoFactor"] === "2FA is enabled, TOTP code required")
				navigateTo("/two-factor", { username: username, password: password });
			else if ((response["error"] && response["error"].includes("user")) || response["authorization"] === 'failed')
				throw new Error("Username or Password may be incorrect");
			else
				throw new Error(response["error"]);
		}
		else
			navigateTo("\home");
		return (true);
	}
	catch (error){
		showAlert(error, "toast-error");
		return (false);
	}
}

async function handleRegister(e) {
	e.preventDefault();
	const username = document.getElementById("username").value;
	const email = document.getElementById("signup-email").value;
	const password = document.getElementById("new-password").value;
	const confirmPassword = document.getElementById("confirm-password").value;
	document.getElementById("signup-form").reset();

	try {
		const msg = parseSessionForm(username, password, email, confirmPassword);
		if (msg !== "Ok")
			throw new Error(msg);

		const response = await sendRequest('POST', 'register', {username: username, email: email, password: password, confirm_password: confirmPassword});
		if (response["error"]) {
			if (response["error"].includes("username"))
				throw new Error("Username already exists");
			else if (response["error"].includes("email"))
				throw new Error("Email already in use");
			else if (response["error"].includes("password"))
				throw new Error("Password is not valid");
			else
				throw new Error(response["error"]);
		}
		else
			showAlert("User create successfully", "toast-success");
		return (true);
	}
	catch (error) {
		console.error(`Error: `, error);
		showAlert(error, "toast-error");
		return (false);
	}
}


export async function sendRequest(method, endpoint, body = null) {
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
		console.error(`Error during fetch in ${method} ${endpoint}:`, error);
		return false;
	}
}


async function recoverPassword(e) {
	e.preventDefault();
	const email = document.getElementById("email-password-recovery").value;
	document.getElementById("recover-password-form").reset();
	try {
		const response = await sendRequest('POST', 'reset', {email: email});
		if (response["error"])
			throw new Error(response["error"]);
		else {
			const msg = document.getElementById("recover-password-message");
			msg.innerText = "Email sent succesfully! Go check it to reset your password";
		}

	}
	catch (error){
		showAlert(error, "toast-error");
	}
}

async function fetchDisplayTerms() {
	try {
		const response = await fetch(`./components/login-page/privacy-policy.html`);
		const content = await response.text();
		const sectionCondition = document.querySelector("#privacy-policy");
		sectionCondition.innerHTML = content;
	}
	catch (error) {
		console.error(`Error during fetch in ${method} ${endpoint}:`, error);
		return (false);
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

window.handleGoogleLogin = async (response) => {
	try {
		console.log(response);
		const data = await sendRequest('POST', 'google/login', response);
		if (data["token"])
			navigateTo("/home");
		else
			throw new Error(data["error"]);
	}
	catch (error) {
		console.log(error);
	}
}



