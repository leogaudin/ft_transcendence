import { showAlert } from "../toast-alert/toast-alert.js";
import { sendRequest } from "../login-page/login-fetch.js";
import { navigateTo } from "../../router.js";


export function initTwoFactorEvents(argument) {
	twoFactorAuth(argument);
}

export function twoFactorAuth(argument) {
	const submitCode = document.getElementById("twoFA-code");

	submitCode.addEventListener("submit", async (e) => {
		try {
			e.preventDefault();
			const valueCode = document.getElementById("twoFA-input").value;
			document.getElementById("twoFA-code").reset();
			const response = await sendRequest('POST', 'login', {username: argument.username, password: argument.password, totp: valueCode});
	
			console.log("respuesta del 2FA", response);
			if (!response["id"])
					throw new Error("Invalid code");
			else
				navigateTo("/home");
		}
		catch (error) {
			showAlert(error, "toast-error");
			return (false);
		}
	});
}