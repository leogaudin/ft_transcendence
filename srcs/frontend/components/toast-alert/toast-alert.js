export function displayToast() {
	const toastAlert = document.getElementById("toast-default");
	toastAlert.addEventListener("click", function (event) {
		if (event.target.classList.contains("close-icon")) {
			toastAlert.style.display = "none";
		}
	});
}

export function showAlert(msg) {
	const toastText = document.getElementById("toast-message");
	const toastAlert = document.getElementById("toast-default");
	toastText.innerText = msg;
	toastAlert.style.display = "flex";
}