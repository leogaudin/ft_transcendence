import { navigateTo } from "../index.js";
import { initHomeFetches } from "./home-fetch.js"

export function initHomeEvents() {
	initHomeFetches();
	setHomeAttributes();
	dropDown();
}

function setHomeAttributes() {
	const usernameText = document.getElementById("username") as HTMLSpanElement;
	if (usernameText) {
		const username = localStorage.getItem("username");
		if (username)
			usernameText.innerText = " " + username;
	}
}

function dropDown(){
	const dropdownButton = document.getElementById("profile-button");
	const dropdownOptions = document.getElementById("profile-options");
	if (!dropdownButton || !dropdownOptions)
		return;

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
		const target = e.target as HTMLElement;
		const key = target.getAttribute('profile_key');
		if (key)
			navigateProfileOptions(key);
	});
}

function navigateProfileOptions(option: string) {
	const dropdownButton = document.getElementById("profile-button");
	if (!dropdownButton)
		return;
	const profileOptions = [
		{ key: 'modifyProfile', label: '/modify-profile' },
		{ key: 'settings', label: '/settings' },
		{ key: 'logOut', label: '/login' },
	];

	const profileOption = profileOptions.find((elem) => elem.key == option);
	if (profileOption)
		navigateTo(profileOption.label);
}