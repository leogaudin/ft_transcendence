import { dropDown } from "../login-page/login-page.js"
import { fetchDisplayTerms } from "../login-page/login-fetch.js"
import { moveBetweenInputs } from "../two-factor-page/two-factor.js";
import { closeModal } from "../friends/friends-page.js";
import { moveToHome } from "../messages/messages-page.js";
import { initSettingsFetch, displayQR } from "./settings-fetch.js";

export function initSettingsEvents() {
	dropDown();
	displayTerms();
	moveBetweenInputs();
	initButtons();
	moveToHome();
	initSettingsFetch();
}

function initButtons() {
	const changePasswordButton = document.getElementById("change-password-button") as HTMLButtonElement;
	const twoFactorButton = document.getElementById("two-factor-button") as HTMLButtonElement;
	const blockedAccountsButton = document.getElementById("blocked-accounts-button") as HTMLButtonElement;
	const deleteAccountButton = document.getElementById("delete-account-button") as HTMLButtonElement;
	if (!changePasswordButton || !twoFactorButton || !blockedAccountsButton || !deleteAccountButton)
		return ;

	changePasswordButton.onclick = () => { displayOption(0) };
	twoFactorButton.onclick = () => { displayOption(1), displayQR() };
	blockedAccountsButton.onclick = () => { displayOption(2) };
	deleteAccountButton.onclick = () => { displayDeletePopUp() };
}

function displayOption(option: number) {
	resetOptions();
	const changePassword = document.getElementById("change-password") as HTMLButtonElement;
	const twoFactor = document.getElementById("two-factor") as HTMLButtonElement;
	const blockedAccounts = document.getElementById("blocked-accounts") as HTMLButtonElement;
	const settingsDiv = document.getElementById('settings-div');
	if (!changePassword || !twoFactor || !blockedAccounts || !settingsDiv)
		return ;
	
	const arrayOptions = [ changePassword, twoFactor, blockedAccounts]; 
	if (arrayOptions) {
		settingsDiv.classList.add('slide-left');
		arrayOptions[option].classList.remove('hide');
	}
}

function resetOptions() {
	const changePassword = document.getElementById("change-password") as HTMLButtonElement;
	const twoFactor = document.getElementById("two-factor") as HTMLButtonElement;
	const blockedAccounts = document.getElementById("blocked-accounts") as HTMLButtonElement;
	const deleteAccount = document.getElementById("delete-account") as HTMLButtonElement;
	const settingsDiv = document.getElementById('settings-div');
	if (!changePassword || !twoFactor || !blockedAccounts || !deleteAccount || !settingsDiv)
		return ;
	
	const arrayOptions = [ changePassword, twoFactor, blockedAccounts, deleteAccount]; 
	if (arrayOptions) {
		arrayOptions.forEach(option => {
			settingsDiv.classList.remove('slide-left');
			option.classList.add('hide');
		});
	}
}

async function displayTerms() {
	const settingsPage = document.getElementById("settings-div");
	const termsButton = document.getElementById("terms-conditions-button");
	const termsPage = document.getElementById("terms-and-conditions");
	const changePassword = document.getElementById("change-password") as HTMLButtonElement;
	const twoFactor = document.getElementById("two-factor") as HTMLButtonElement;
	const blockedAccounts = document.getElementById("blocked-accounts") as HTMLButtonElement;
	await fetchDisplayTerms();

	if (!settingsPage || !termsButton || !termsPage || !changePassword || !twoFactor || !blockedAccounts)
		return ;
	termsButton.addEventListener("click", () => {
		resetOptions();
		if (!termsPage.style.display || termsPage.style.display === "none") {
			settingsPage.style.display = "none";
			termsPage.style.display = "flex";
			termsButton.innerText = "Settings";

			changePassword.classList.add('hidden');
			twoFactor.classList.add('hidden');
			blockedAccounts.classList.add('hidden');
		}
		else {
			settingsPage.style.display = "flex";
			termsPage.style.display = "none";
			termsButton.innerText = "Privacy and Terms Conditions";

			changePassword.classList.remove('hidden');
			twoFactor.classList.remove('hidden');
			blockedAccounts.classList.remove('hidden');
		}
	})
}

function displayDeletePopUp() {
	const deleteAccount = document.getElementById("delete-account") as HTMLDialogElement;
	const closeButton = document.getElementsByClassName("close-icon")[0] as HTMLButtonElement;
	if (!deleteAccount || !closeButton)
		return;
	deleteAccount.style.display = "flex";
	deleteAccount.showModal();

	closeButton.onclick = () => { closeModal(deleteAccount) };
}
