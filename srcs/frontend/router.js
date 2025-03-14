import { initLoginEvents } from "./components/login-page/login-page.js";
import { initResetPasswordEvents } from "./components/reset-password-page/reset-password.js";
import { initTwoFactorEvents } from "./components/two-factor-page/two-factor.js";
import { displayToast } from "./components/toast-alert/toast-alert.js";

const routes = [
	{ path: "/", url: ""},
	{ path: "/home",url: "./components/home-page/home-page.html"},
	{ path: "/login",url: "./components/login-page/login-page.html"},
	{ path: "/reset-password", url: "./components/reset-password-page/reset-password.html" },
	{ path: "/two-factor", url: "./components/two-factor-page/two-factor.html"}
];

export function navigateTo(path, argument = null) {
	console.log(`Navegando a: ${path}`);
	history.pushState(null, "", path);
	loadContent(path, argument);
}

async function loadContent(path, argument = null) {
	try {
		const route = routes.find(r => r.path === path);
		if (!route)
			throw ("Ruta no encontrada");
		
		const response = await fetch(route.url);
		const content = await response.text();
		document.getElementById("app").innerHTML = content;
		loadEvents(path, argument);
	}
	catch (error) {
		console.error("Error al cargar la página:", error);
	}
}


function loadEvents(path, argument = null) {
	switch (path) {
		case "/":
			console.log("executing events for home");
			break;
		case "/login":
			initLoginEvents();
			break;
		case "/reset-password":
			initResetPasswordEvents();
			break;
		case "/two-factor":
			initTwoFactorEvents(argument);
			break;
		// default:
		//     loadNotFoundPage();
		//     break;
	}
}

async function initBaseEvents() {
	try {
		const response = await fetch("./components/toast-alert/toast-alert.html");
		const content = await response.text();
		document.getElementById("base").innerHTML = content;
		displayToast();
	}
	catch (error) {
		console.error("Error al cargar la página:", error);
	}
}
			
// Managing back and forward button
window.onpopstate = () => {
	console.log("I entered in onpopstate, window.location.pathname: ", window.location.pathname);
	loadContent(window.location.pathname);
};

// Load page correctly when writing it directly on navbar
document.addEventListener("DOMContentLoaded", () => {
	console.log("window.location.pathname: ", window.location.pathname);
	initBaseEvents();
	loadContent(window.location.pathname);
});
