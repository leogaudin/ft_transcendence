let toastTimeout;

const toastFeatures = [
	{type: "toast-error", icon: "error-icon"},
	{type: "toast-success", icon: "check-icon"}
];

function defineToastFeatures(type) {
	const toast = document.getElementById("toast-default");
	const icon = document.getElementById("toast-icon");

	for (let i = 0; i < toastFeatures.length; i++) {
		if (toast.classList.contains(toastFeatures[i].type))
			toast.classList.remove(toastFeatures[i].type);
		if (icon.classList.contains(toastFeatures[i].icon))
			icon.classList.remove(toastFeatures[i].icon);

		if (toastFeatures[i].type === type) {
			toast.classList.add(toastFeatures[i].type);
			icon.classList.add(toastFeatures[i].icon);
		}
	}
}

export function displayToast() {
	const toastAlert = document.querySelector("#toast-default");
	toastAlert.addEventListener("click", function (event) {
		if (event.target.classList.contains("close-icon")) {
			toastAlert.style.display = "none";
		}
	});
}

export function showAlert(msg, toastType) {
	const toastText = document.getElementById("toast-message");
	const toastAlert = document.getElementById("toast-default");
	
	defineToastFeatures(toastType);
	toastText.innerText = msg;
	toastAlert.style.display = "flex";

	if (toastTimeout) { clearTimeout(toastTimeout); }
	toastTimeout = setTimeout(() => { toastAlert.style.display = "none"; }, 5000);
}