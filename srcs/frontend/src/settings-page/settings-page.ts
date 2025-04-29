import { dropDown } from "../login-page/login-page.js"
import { fetchDisplayTerms } from "../login-page/login-fetch.js"
import { moveBetweenInputs } from "../two-factor-page/two-factor.js";
import { closeModal } from "../friends/friends-page.js";

export function initSettingsEvents() {
	dropDown();
	displayTerms();
	moveBetweenInputs();
	initButtons();
}

function initButtons() {
	const deleteAccountButton = document.getElementsByClassName("delete-option")[0] as HTMLButtonElement;
	if (deleteAccountButton)
		deleteAccountButton.onclick = () => { displayDeletePopUp() };
}

async function displayTerms() {
	console.log("Entro");
	const settingsPage = document.getElementById("settings-div");
	const termsButton = document.getElementById("terms-conditions-button");
	const termsPage = document.getElementById("terms-and-conditions");
	await fetchDisplayTerms();

	if (!settingsPage || !termsButton || !termsPage)
		return ;
	console.log("Todo existe");
	termsButton.addEventListener("click", () => {
		if (!termsPage.style.display || termsPage.style.display === "none") {
			settingsPage.style.display = "none";
			termsPage.style.display = "flex";
			termsButton.innerText = "Settings";
		}
		else {
			settingsPage.style.display = "flex";
			termsPage.style.display = "none";
			termsButton.innerText = "Privacy and Terms Conditions";
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
