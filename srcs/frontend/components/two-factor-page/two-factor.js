import { showAlert } from "../toast-alert/toast-alert.js";
import { sendRequest } from "../login-page/login-fetch.js";
import { navigateTo } from "../../router.js";


export function initTwoFactorEvents(argument) {
	twoFactorAuth(argument);
	moveBetweenInputs();
}

function moveBetweenInputs() {
	const inputs = document.querySelectorAll(".twoFA-input");
        inputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                if (e.inputType !== "deleteContentBackward" && input.value) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                }
            });
            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && !input.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
}

export function twoFactorAuth(argument) {
    const submitCode = document.getElementById("twoFA-code");

    submitCode.addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            
            const inputs = document.querySelectorAll(".twoFA-input");
            const valueCode = Array.from(inputs).map(input => input.value).join("");
            submitCode.reset();

			if (!valueCode || valueCode.length < 6)
				throw new Error("Fill in all the fields");

            const response = await sendRequest('POST', 'login', {
                username: argument.username,
                password: argument.password,
                totp: valueCode
            });

            if (!response["id"])
				throw new Error("Invalid code");
            else
				navigateTo("/home");
        } 
		catch (error) {
            showAlert(error, "toast-error");
            return false;
        }
    });
}