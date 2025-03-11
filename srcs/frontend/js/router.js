const routes = [
	{ path: "/", url: "../index.html"},
    { path: "/reset-password", url: "../reset-password.html" }
];

const testButton = document.getElementById("test-button");
testButton.addEventListener("click", () => navigateTo(routes[1].path));

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
		
	}
	catch (error) {
		console.error("Error al cargar la página:", error);
	}
}
// Manejar la navegación con botones de "Atrás" y "Adelante"
window.onpopstate = () => {
	console.log("I entered in onpopstate, window.location.pathname: ", window.location.pathname);
    loadContent(window.location.pathname);
};

// Cargar la página correcta si se accede directamente a una ruta
document.addEventListener("DOMContentLoaded", () => {
	console.log("window.location.pathname: ", window.location.pathname);
    loadContent(window.location.pathname);
});

