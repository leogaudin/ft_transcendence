import { showAlert } from "../toast-alert/toast-alert.js";
import { sendRequest } from "../login-page/login-fetch.js";
import { navigateTo } from "../index.js";
import { LoginObject } from "../types.js";


export function initTwoFactorEvents(data: LoginObject) {
	twoFactorAuth(data);
	moveBetweenInputs();
}

function moveBetweenInputs() {
	const inputs = Array.from(document.getElementsByClassName("twoFA-input"));

    for (let index = 0; index < inputs.length; index++) {
        const previous = index > 0 ? inputs[index - 1] as HTMLInputElement : null;
        const current = inputs[index] as HTMLInputElement;
        const next = index < inputs.length - 1 ? inputs[index + 1] as HTMLInputElement : null

        current.addEventListener("input", (e: Event) => {
            if ((e as InputEvent).inputType !== "deleteContentBackward" && current.value) {
                if (next)
                    next.focus();
            }
        });
        current.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !current.value && previous) {
                previous.focus();
            }
        });
    }
}

export function twoFactorAuth(data: LoginObject) {
    const submitCode = document.getElementById("twoFA-code") as HTMLFormElement;
    if (!submitCode)
        return;

    submitCode.addEventListener("submit", async (e: Event) => {
        try {
            e.preventDefault();

            const inputs = Array.from(document.getElementsByClassName("twoFA-input"));
            const valueCode = inputs.map(input => (input as HTMLInputElement).value).join("");
            submitCode.reset();

			if (!valueCode || valueCode.length < 6)
				throw new Error("Fill in all the fields");

            const response = await sendRequest('POST', 'login', {
                username: data.username,
                password: data.password,
                totp: valueCode
            });

            if (!response["id"])
				throw new Error("Invalid code");
            else
				navigateTo("/home");
        }
		catch (error) {
            showAlert((error as Error).message, "toast-error");
            return false;
        }
    });
}
