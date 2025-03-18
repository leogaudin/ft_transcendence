import { navigateTo } from "../index.js";

export function initHomeEvents() {
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