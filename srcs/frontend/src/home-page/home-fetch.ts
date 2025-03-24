import { navigateTo } from "../index.js";

/**
 * @brief Inits the associated Home Fetches
 * @note Export because it'll be called on home-page.js
 */
export function initHomeFetches() {
	goMessages();
}

/**
 * @brief Redirects the user to Messages Page
 * @note Activated when "messages" button has been clicked
 */
function goMessages() {
	const messagesPageButton = document.getElementById("messages");
	if (!messagesPageButton)
		return ;

	messagesPageButton.addEventListener("click", () => {
		navigateTo("/messages");
	});
}