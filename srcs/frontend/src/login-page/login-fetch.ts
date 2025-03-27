import { showAlert } from "../toast-alert/toast-alert.js";
import { navigateTo } from "../index.js";
import { LoginObject } from "../types.js";


/**
 * @brief Inits the associated Login Fetches and buttons
 * @note Export because it'll be called on login-page.js
 */
export function initLoginFetches() {
	const signupSubmit = document.getElementById("signup-form");
	const loginSubmit = document.getElementById("login-form");
	const recoverPasswordSubmit = document.getElementById("recover-password-form");

	if (!signupSubmit || !loginSubmit || !recoverPasswordSubmit)
		return;
	signupSubmit.addEventListener("submit", handleRegister);
	loginSubmit.addEventListener("submit", handleLogin);
	recoverPasswordSubmit.addEventListener("submit", recoverPassword);
	displayTerms();
}

/**
 * @brief Parses the auth forms before doing a fetch to assure everything is alright
 * @param email Default value on Login Form
 * @param confirmPassword Default value on Login Form
 * @returns Personalized msg for all cases
 */
export function parseSessionForm(
	username: string,
	password: string,
	email: string = "Default",
	confirmPassword: string = password
) {
	let msg: string = "Ok";

	if (!username || !email || !password || !confirmPassword)
		msg = "Fill in all the fields";
	else if (email !== "Default") {
		if (username.length < 4)
			msg = "Username too short";
		else if (username.length > 16)
			msg = "Username too long (max 16 characters)";
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

/**
 * @brief Checks the Login form when sent
 * @param e Submit event refresh the page, including e allows you to prevent it
 */
async function handleLogin(e: Event) {
	e.preventDefault();
	const usernameField = document.getElementById("login-username") as HTMLInputElement;
	const passwordField = document.getElementById("password") as HTMLInputElement;
	if (!usernameField || !passwordField)
		return ;

	const username = usernameField.value;
	const password = passwordField.value;

	try {
		const msg = parseSessionForm(username, password);
		if (msg !== "Ok")
			throw new Error(msg);

		const response = await sendRequest('POST', 'login', { username, password });
		if (!response["id"]) {
			if (response["twoFactor"] === "2FA is enabled, TOTP code required") {
				const data: LoginObject = { username, password };
				navigateTo("/two-factor", data);
			}
			else if ((response["error"] && response["error"].includes("user")) || response["authorization"] === 'failed')
				throw new Error("Username or Password may be incorrect");
			else
				throw new Error(response["error"]);
		}
		else {
			initSession(response);
		}
		const form = document.getElementById("login-form") as HTMLFormElement;
		if (form)
			form.reset();
		return (true);
	}
	catch (error) {
		showAlert((error as Error).message, "toast-error");
		return (false);
	}
}

/**
 * @brief Stores in localStorage the data of the user who just logged
 * @param response The user data returned by the backend
 * @returns If everything ok navigates you to the Home Page
 */
async function initSession(response: object) {
	Object.entries(response).forEach(([key, value])=> {
		if (typeof value !== 'object' || value === null) {
			localStorage.setItem(key, String(value));
			// console.log("storing: ", key, ", ", String(value));
		}
		else {
			localStorage.setItem(key, JSON.stringify(value));
			// console.log("storing: ", key, ", ", JSON.stringify(value));
		}
	});

	
	// const token = localStorage.getItem("token");
	// if (!token)
	// 	return ;
	// const authorization = {Authorization: `Bearer ${token}`};
	// const messages = await sendRequest("GET", "users/messages", {}, authorization);

	const messages = await sendRequest("GET", "users/messages");
	Object.entries(messages).forEach(([key, value])=> {
			localStorage.setItem(key, JSON.stringify(value));
			// console.log("storing: ", key, ", ", JSON.stringify(value));
	});

	console.log(messages);
	navigateTo("/home");
} 

/**
 * @brief Checks the Register form when sent
 * @param e Submit event refresh the page, including e allows you to prevent it
 * @returns true if user was created | false if not
 */
async function handleRegister(e: Event) {
	e.preventDefault();
	const usernameField = document.getElementById("username") as HTMLInputElement;
	const emailField = document.getElementById("signup-email") as HTMLInputElement;
	const passwordField = document.getElementById("new-password") as HTMLInputElement;
	const confirmPasswordField = document.getElementById("confirm-password") as HTMLInputElement;
	if (!usernameField || !emailField || !passwordField || !confirmPasswordField)
		return ;

	const username = usernameField.value;
	const email = emailField.value;
	const password = passwordField.value;
	const confirm_password = confirmPasswordField.value;

	try {
		const msg = parseSessionForm(username, password, email, confirm_password);
		if (msg !== "Ok")
			throw new Error(msg);

		const response = await sendRequest("POST", "register", {username, email, password, confirm_password});
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
		const form = document.getElementById("signup-form") as HTMLFormElement;
		if (form)
			form.reset();
		return (true);
	}
	catch (error) {
		console.error(`Error: `, error);
		showAlert((error as Error).message , "toast-error");
		return (false);
	}
}

/**
 * Standard function to make Requests to the backend
 * @param method 
 * @param endpoint 
 * @param body 
 * @param header 
 * @returns 
 */
export async function sendRequest(method: string, endpoint: string, body: object = {}, header: object = {}) {
	try {
		let response;
		
		// Object.keys return an array, which contains the property names of the object.
		if (Object.keys(body).length !== 0) {
			response = await fetch(`http://localhost:9000/${endpoint}`, {
				method,
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...header
				},
				body: JSON.stringify(body)
			});
		}
		else {
			response = await fetch(`http://localhost:9000/${endpoint}`, {
				method,
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...header
				},
			});
		}
		return await response.json();
	}
	catch (error) {
		console.error(`Error during fetch in ${method} ${endpoint}:`, error);
		return false;
	}
}


async function recoverPassword(e: Event) {
	e.preventDefault();
	const emailField = document.getElementById("email-password-recovery") as HTMLInputElement;
	if (!emailField)
		return ;

	const email = emailField.value;
	try {
		const response = await sendRequest('POST', 'reset', {email});
		if (response["error"])
			throw new Error(response["error"]);
		else {
			const msg = document.getElementById("recover-password-message") as HTMLElement;
			msg.innerText = "Email sent succesfully! Go check it to reset your password";
		}
		const form = document.getElementById("recover-password-form") as HTMLFormElement;
		if (form)
			form.reset();

	}
	catch (error) {
		showAlert((error as Error).message, "toast-error");
	}
}

async function fetchDisplayTerms() {
	try {
		const response = await fetch(`../src/login-page/privacy-policy.html`);
		const content = await response.text();
		const sectionCondition = document.querySelector("#privacy-policy");
		if (sectionCondition)
			sectionCondition.innerHTML = content;
	}
	catch (error) {
		console.error(`Error in fetchDisplayTerms`, error);
		return (false);
	}
}

async function displayTerms() {
	const signUpPage = document.getElementById("sign-up-page");
	const signInPage = document.getElementById("login-page");
	const termsButton = document.getElementById("terms-conditions-button");
	const termsPage = document.getElementById("terms-and-conditions");
	await fetchDisplayTerms();

	if (!signUpPage || !signInPage || !termsButton || !termsPage)
		return ;
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

(window as any).handleGoogleLogin = async (response: object) => {
	try {
		const data = await sendRequest('POST', 'google/login', response);
		// if (data["token"])
		// 	initSession(data);
    if (data["success"])
      initSession(data);
		else
			throw new Error(data["error"]);
	}
	catch (error) {
		console.log(error);
	}
}



