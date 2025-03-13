import { showAlert } from "../toast-alert/toast-alert.js";
import { parseSessionForm, sendRequest } from "../login-page/login-fetch.js";
import { navigateTo } from "../../router.js";

export function initResetPasswordEvents() {
	moveToLogin();
	recoverPasswordFetches();
}

function moveToLogin() {
	const homeButton = document.getElementById("home-button");
	homeButton.addEventListener("click", () => {
		console.log("I listened ;)");
		navigateTo("/login");
	});
}

function recoverPasswordFetches() {
	const resetPasswordSubmit = document.getElementById("reset-password-form");
	resetPasswordSubmit.addEventListener("submit", resetPassword);
}

async function resetPassword(e) {
	e.preventDefault();
	const params = new URLSearchParams(document.location.search);
	const token = params.get("token");
	const id = params.get("id");
	const password = document.getElementById("first-password-recovery").value;
	const repeatPassword = document.getElementById("second-password-recovery").value;
	document.getElementById("reset-password-form").reset();

	try {
		const msg = parseSessionForm("username", password, "default@test.com", repeatPassword);
		if (msg !== "Ok")
			throw new Error(msg);

		const response = await sendRequest('POST', 'resetToken', {token: token, id: id, password: password, confirm_password: repeatPassword});
		if (response["success"]) {
			const msg = document.getElementById("reset-password-message");
			msg.innerText = "Change of password was successful. You can now return to login page!";
		}
		else
			throw new Error(response["error"]);
	}
	catch (error) {
		showAlert(error, "toast-error");
	}
}