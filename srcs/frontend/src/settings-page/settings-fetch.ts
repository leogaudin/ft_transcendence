import { sendRequest } from "../login-page/login-fetch.js";
import { showAlert } from "../toast-alert/toast-alert.js";
import { navigateTo } from "../index.js";

export function initSettingsFetch() {
	const changePasswordForm  = document.getElementById("change-password-form") as HTMLFormElement;
	if (changePasswordForm)
		changePasswordForm.addEventListener('submit', changePassword );

	const deleteAccountForm = document.getElementById("delete-account-form") as HTMLFormElement;
	if (deleteAccountForm)
		deleteAccountForm.addEventListener('submit', deleteAccount);

	const qrForm = document.getElementById("twoFA-code") as HTMLFormElement;
	if (qrForm)
		qrForm.addEventListener('submit', twoFactorAuth);
}

function parsePasswords(currentPassword: string, newPassword: string, confirmNewPassword: string): boolean {
	try {
		if (!currentPassword || !newPassword || !confirmNewPassword)
			throw new Error("Fill in all the fields");
		else if (newPassword !== confirmNewPassword)
			throw new Error("Passwords don't match");
		else if (newPassword.length < 9)
			throw new Error("Password too short");
		else if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[*\.\-_]/.test(newPassword))
			throw new Error("Please use at least one uppercase, lowercase, number and '*.-_'");
		return true;
	}
	catch (error) {
		showAlert((error as Error).message, "toast-error");
		return false;
	}
}

async function changePassword(e: Event) {
	e.preventDefault();
	const currentPassword = document.getElementById("password") as HTMLInputElement;
	const newPassword = document.getElementById("new-password") as HTMLInputElement;
	const repeatPassword = document.getElementById("confirm-password") as HTMLInputElement;
	if (!currentPassword || !newPassword || !repeatPassword)
		return ;

	const currentPasswordValue = currentPassword.value;
	const newPasswordValue = newPassword.value;
	const repeatPasswordValue = repeatPassword.value;
	if (!parsePasswords(currentPasswordValue, newPasswordValue, repeatPasswordValue))
		return ;
	try {
		const response = await sendRequest('PATCH', 'users/password', { current_password: currentPasswordValue, new_password: newPasswordValue, new_password_confirm: repeatPasswordValue });
		if (!response["success"])
			throw new Error(response["error"]);
		else
			showAlert("Password changed successfully", "toast-success");
		const form = document.getElementById("change-password-form") as HTMLFormElement;
		if (form)
			form.reset();
		return ;
	}
	catch (error) {
		showAlert((error as Error).message, "toast-error");
		return ;
	}
}

async function deleteAccount(e: Event) {
	e.preventDefault();
	const emailInput = document.getElementById("delete-email") as HTMLInputElement;
	const passwordInput = document.getElementById("delete-password") as HTMLInputElement;
	const deleteInput = document.getElementById("delete-confirm") as HTMLInputElement;

	if  (!emailInput || !passwordInput || !deleteInput)
		return ;

	const emailValue = emailInput.value;
	const passwordValue = passwordInput.value;
	const deleteValue = deleteInput.value;
	try {
		if (!emailValue || !passwordValue || !deleteValue)
			throw new Error("Fill in all the fields");
		else if (deleteValue !== "Delete")
			throw new Error("Incorrect confirm message");
		const response = await sendRequest('DELETE', 'users', { email: emailValue, password: passwordValue, delete_input: deleteValue})
		if (!response["success"])
			throw new Error(response["error"]);
		else {
			showAlert("Account deleted successfully", "toast-success");
			displayDeletedAccount();
		}
		const form = document.getElementById("delete-account-form") as HTMLFormElement;
		if (form)
			form.reset();
		return ;
	}
	catch (error) {
		showAlert((error as Error).message, "toast-error");
		return ;
	}
}

function displayDeletedAccount() {
	const deleteForm = document.getElementById("delete-account-form") as HTMLFormElement;
	const deleteMessage = document.getElementById("delete-account-message") as HTMLElement;
	const closeIcon = document.getElementsByClassName("close-icon")[0] as HTMLElement;
	const logOutButton = document.getElementById("log-out") as HTMLButtonElement;
	if (!deleteForm || !deleteMessage || !closeIcon || !logOutButton)
		return ;	
	deleteForm.style.display = "none";
	closeIcon.style.display = "none";
	deleteMessage.classList.add("text-center");
	deleteMessage.innerText = `Your account has been deleted.
		If you log-in with your credentials in the next 30 days you'll recover it.
		We'll miss you!!`
	logOutButton.classList.remove("hidden");
	logOutButton.onclick = () => { navigateTo('/login'); };
}

export async function displayQR() {
	if (localStorage.getItem("is_2fa_enabled") === "1") {
		const activateButton = document.getElementById("activate-button") as HTMLButtonElement;
		const deactivateButton = document.getElementById("deactivate-button") as HTMLButtonElement;
		activateButton.classList.add("hidden");
		deactivateButton.classList.remove("hidden");
		return ;
	}
	const qrImg = document.getElementById("QR-2FA") as HTMLImageElement;
	qrImg.classList.remove("hidden");

	try {
		const response = await sendRequest('GET', '2fa/enable');
		if (!response["qr_code"])
			throw new Error(response["error"]);
		else
			qrImg.src=response.qr_code;
		return ;
	}
	catch (error) {
		showAlert((error as Error).message, "toast-error");
		return ;
	}
}

async function twoFactorAuth(e: Event) {
	e.preventDefault();
	const qrForm = document.getElementById("twoFA-code") as HTMLFormElement;
	const inputs = Array.from(document.getElementsByClassName("twoFA-input"));
	const valueCode = inputs.map(input => (input as HTMLInputElement).value).join("");
	try {
		if (!valueCode || valueCode.length < 6)
			throw new Error("Fill in all the fields");
		qrForm.reset();
		
		if (localStorage.getItem("is_2fa_enabled") === "1") {
			const response = await sendRequest('POST', '2fa/disable', {totp_code: valueCode});
			if (!response["success"])
				throw new Error(response["error"]);
			localStorage.setItem("is_2fa_enabled", "0");
			showAlert("2FA disabled successfully", "toast-success");
		}
		else {
			const response = await sendRequest('POST', '2fa/verify', {totp_code: valueCode});
			if (!response["success"])
				throw new Error(response["error"]);
			localStorage.setItem("is_2fa_enabled", "1");
			showAlert("2FA enabled successfully", "toast-success");
		}
		toggle2FA();
	}
	catch (error) {
		showAlert((error as Error).message, "toast-error");
		return false;
	}
}

function toggle2FA() {
	const activateButton = document.getElementById("activate-button") as HTMLButtonElement;
	const deactivateButton = document.getElementById("deactivate-button") as HTMLButtonElement;
	const qrImg = document.getElementById("QR-2FA") as HTMLImageElement;
	if (!activateButton || !deactivateButton || !qrImg)
		return ;

	if (localStorage.getItem("is_2fa_enabled") === "1") {
		qrImg.classList.add("hidden");
		activateButton.classList.add("hidden");
		deactivateButton.classList.remove("hidden");
	}
	else {
		qrImg.classList.remove("hidden");
		displayQR();
		activateButton.classList.remove("hidden");
		deactivateButton.classList.add("hidden");
	}
}