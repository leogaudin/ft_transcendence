const signupSubmit = document.getElementById("signup-form");
const loginSubmit = document.getElementById("login-form");
signupSubmit.addEventListener("submit", handleRegister);
loginSubmit.addEventListener("submit", handleLogin);

function parseSessionForm(username, password, email = "Default", confirmPassword = password) {
    let msg = "Ok";

    if (!username || !email || !password || !confirmPassword)
        msg = "Fill in all the fields";
    else if (email !== "Default") {
        if (username.length < 6)
            msg = "Username too short";
        else if (!/^[a-z0-9]+$/gi.test(username))
            msg = "Username can only contain lowercase and digits";
        else if (password !== confirmPassword)
            msg = "Passwords don't match";
        else if (password.length < 9)
            msg = "Password too short";
        else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[*\.\-_]/.test(password))
            msg = "Please use at least one uppercase, lowercase, number and '*.-_'";
    }

    return (msg);
}

async function handleLogin() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("password").value;

    try {
        const msg = parseSessionForm(username, password);
        if (msg !== "Ok")
            throw new Error(msg);
        
        const response = await sendRequest('POST', 'login', {username: username, password: password});
        if (!response["id"]) {
            if ((response["error"] && response["error"].includes("user")) || response["authorization"] === 'failed')
                throw new Error("Username or Password may be incorrect");
            else
                throw new Error(response["error"]);
        }
        else
            showAlert("User entered successfully");
        return (true);
    }
    catch (error){
        console.error(`Error: `, error);
        showAlert(error);
        return (false);
    }
}

async function handleRegister() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    try {
        const msg = parseSessionForm(username, password, email, confirmPassword);
        if (msg !== "Ok")
            throw new Error(msg);

        const response = await sendRequest('POST', 'register', {username: username, email: email, password: password, confirm_password: confirmPassword});
        if (response["error"]) {
            if (response["error"].includes("username"))
                throw new Error("Username already exists");
            else if (response["error"].includes("email"))
                throw new Error("Email already in use");
            else if (response["error"].includes("password"))
                throw new Error("Password is not valid");
            else
                throw new Error(response["error"]);
        }
        else
            showAlert("User create successfully");
        return (true);farola
    }
    catch (error) {
        console.error(`Error: `, error);
        showAlert(error);
        return (false);
    }
}


async function sendRequest(method, endpoint, body = null) {
    try {
        const response = await fetch(`http://localhost:9000/${endpoint}`, {
            method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null
        });
        return await response.json();
    }
    catch (error) {
        console.error(`Error during fetch in ${method} ${endpoint}:`, error);
        return false;
    }
}

const recoverPasswordSubmit = document.getElementById("recover-password-form");
recoverPasswordSubmit.addEventListener("submit", recoverPassword);

async function recoverPassword() {
    const email = document.getElementById("email-password-recovery").value;
    const response = await sendRequest('POST', 'reset', {email: email});
    console.log(response);
    if (response["error"])
        showAlert("Email not found in database");
    else
        showAlert("Email sent successfully");
}