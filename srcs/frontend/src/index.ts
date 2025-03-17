import { initLoginEvents } from "./login-page/login-page.js";
import { initResetPasswordEvents } from "./reset-password-page/reset-password.js";
import { initTwoFactorEvents } from "./two-factor-page/two-factor.js";
import { displayToast } from "./toast-alert/toast-alert.js";
import { LoginObject } from "./types.js";
console.log("Hello from index.ts");
const routes = [
	{
		path: "/",
		url: "",
		event: () => {}
	},
	{
		path: "/home",
		url: "../src/home-page/home-page.html",
		event: () => {}
	},
	{
		path: "/login",
		url: "../src/login-page/login-page.html",
		event: () => {
			initLoginEvents()
		}
	},
	{
		path: "/reset-password",
		url: "../src/reset-password-page/reset-password.html",
		event: () => {
			initResetPasswordEvents()
		}
	},
	{
		path: "/two-factor",
		url: "../src/two-factor-page/two-factor.html",
		event: (data: object) => {
			initTwoFactorEvents(data as LoginObject);
		}
	}
];

export function navigateTo(path: string, data: object = {}) {
	console.log(`Navegando a: ${path}`);
	history.pushState(null, "", path);
	loadContent(path, data);
}

async function loadContent(path: string, data: object = {}) {
	try {
		const route = routes.find(r => r.path === path);
		if (!route)
			throw ("Ruta no encontrada");

		const response = await fetch(route.url);
		const content = await response.text();
		const app = document.getElementById("app");
		if (app)
			app.innerHTML = content;
		route.event(data);
	}
	catch (error) {
		console.error("Error al cargar la página:", error);
	}
}

async function initBaseEvents() {
	try {
		const response = await fetch("../src/toast-alert/toast-alert.html");
		const content = await response.text();
		const base = document.getElementById("base");
		if (base)
			base.innerHTML = content;
		displayToast();
	}
	catch (error) {
		console.error("Error al cargar la página:", error);
	}
}

// Managing back and forward button
window.onpopstate = () => {
	loadContent(window.location.pathname);
};

// Load page correctly when writing it directly on navbar
document.addEventListener("DOMContentLoaded", () => {
	initBaseEvents();
	loadContent(window.location.pathname);
});
