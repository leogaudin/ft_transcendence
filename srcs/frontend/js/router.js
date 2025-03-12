import { initLoginEvents } from "./loginPage.js";
import { initLoginFetches } from "./loginFetch.js";
import { recoverPasswordFetches } from "./loginFetch.js";
import { displayToast } from "./loginPage.js";

const routes = [
	{ path: "/", url: ""},
	{ path: "/login",url: "../login.html"},
    { path: "/reset-password", url: "../reset-password.html" }
];

function navigateTo(path) {
    console.log(`Navegando a: ${path}`);
    history.pushState(null, "", path);
    loadContent(path);
}

async function loadContent(path) {
	try {
		const route = routes.find(r => r.path === path);
		console.log("route: ", route);
		if (!route)
			throw ("Ruta no encontrada");
		
		const response = await fetch(route.url);
		const content = await response.text();
		document.getElementById("app").innerHTML = content;
		loadEvents(path);
	}
	catch (error) {
		console.error("Error al cargar la página:", error);
	}
}


function loadEvents(path) {
	switch (path) {
		case "/":
			console.log("executing events for home");
            break;
		case "/login":
			loadLoginPage();
			break;
		case "/reset-password":
			console.log("Entrando en inicialización de eventos de recuperación de contraseña");
			recoverPasswordFetches();
			displayToast();
			console.log("Saliendo en inicialización de eventos de recuperación de contraseña");
			break;
		// default:
		//     loadNotFoundPage();
		//     break;
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
	loadContent(window.location.pathname);
});
			
			
function loadLoginPage() {
	initLoginEvents();
	initLoginFetches();
}