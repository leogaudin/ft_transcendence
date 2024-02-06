import { displayChat } from "./utils.js";
import { playLocal, playOnline } from "./gameMode.js";
import { loginPushButton, logOut } from "./register.js";

export async function routerFunctions(){
	const buttons = [
		{ id: "loginButton", event: 'click', handler: loginPushButton },
		{ id: "logOut", event: 'click', handler: logOut },
		{ id: "displayChat", event: 'click', handler: displayChat },
		{ id: "playOnline", event: 'click', handler: playOnline },
		{ id: "playLocal", event: 'click', handler: playLocal },
	];
	
	buttons.forEach(button => {
		const element = document.getElementById(button.id);
		if (element) {
			element.addEventListener(button.event, button.handler);
		}
	});
}