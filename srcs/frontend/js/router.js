import { initLoginEvents } from "./loginPage.js";
import { initLoginFetches } from "./loginFetch.js";

// function handleCredentialResponse(response) {
//     console.log("Encoded JWT ID token: " + response.credential);
// }

// window.onload = function () {
// google.accounts.id.initialize({
// 	client_id: "YOUR_GOOGLE_CLIENT_ID",
// 	callback: handleCredentialResponse
// });
// google.accounts.id.renderButton(
// 	document.getElementById("buttonDiv"),
// 	{ theme: "outline", size: "large" }  // customization attributes
// );
// google.accounts.id.prompt(); // also display the One Tap dialog
// }

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
			console.log("executing events for reset-password");
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