import { navigateTo } from "../index.js";

export function initHomeFetches() {
	goMessages();
}

function goMessages() {
	const messagesPageButton = document.getElementById("messages");
	if (!messagesPageButton)
		return ;

	messagesPageButton.addEventListener("click", () => {
		navigateTo("/messages");
	});
}