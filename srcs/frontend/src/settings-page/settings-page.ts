import { dropDown } from "../login-page/login-page.js"
import { fetchDisplayTerms } from "../login-page/login-fetch.js"

export function initSettingsEvents() {
	dropDown();
	displayTerms();
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
