const locales = [
	{
		code: 'en',
		flag: '🇬🇧',
		label: 'English',
		translations: {
			login_welcome: 'Welcome!',
			login_username: 'Username',
			login_password: 'Password',
			login_sign_in: 'Sign In',
			login_or: 'or',
			login_forgot_password: 'Forgot password?',
			login_no_account: `Don't have an account? `,
			login_sign_up: '&nbsp;Sign up',
			login_create_account: 'Create an account',
			login_repeat_password: 'Repeat the password',
			login_example_username: 'username-example123',
			login_example_email: 'example@email.com',
			login_create: 'Create account',
			login_return_to: 'or return to&nbsp;',
			login_accept_terms: 'By signing up, you agree to our Privacy and Terms Conditions.',
			terms_policy: 'Terms and Privacy Policy',
			language: 'English',
			fill_all_fields: 'Fill in all the fields',
			username_too_short: 'Username too short',
			username_too_long: 'Username too long (max 16 characters)',
			username_allowed_chars: 'Username can only contain lowercase and digits',
			passwords_not_match: `Passwords don't match`,
			password_too_short: 'Password too short',
			password_musts: `Please use at least one uppercase, lowercase, number and '*.-_'`,
			incorrect_inputs: 'Username or Password may be incorrect',
	},
	{
		code: 'es',
		flag: '🇪🇸',
		label: 'Español',
		translations: {
			login_welcome: 'Bienvenido',
			login_username: 'Nombre de usuario',
			login_password: 'Contraseña',
			login_sign_in: 'Iniciar Sesión',
			login_or: 'o',
			login_forgot_password: '¿Olvidaste tu contraseña?',
			login_no_account: `¿No tienes una cuenta? `,
			login_sign_up: '&nbsp;Regístrate',
			login_create_account: 'Registro',
			login_repeat_password: 'Repite la contraseña',
			login_example_username: 'usuario-ejemplo123',
			login_example_email: 'ejemplo@email.es',
			login_create: 'Create una cuenta',
			login_return_to: 'o vuelve a&nbsp;',
			login_accept_terms: 'Al registrarte, aceptas nuestros Términos y Condiciones de Privacidad',
			terms_policy: 'Términos y Políticas de Privacidad',
			language: 'Español',
			fill_all_fields: 'Rellena todos los campos',
			username_too_short: 'Nombre de usuario demasiado corto',
			username_too_long: 'Nombre de usuario demasiado largo (max 16 caracteres)',
			username_allowed_chars: 'El nombre de usuario sólo puede contener minúsculas y barra baja',
			passwords_not_match: `Las contraseñas no coinciden`,
			password_too_short: 'Contraseña demasiado corta',
			password_musts: `Por favor utiliza por lo menos una mayúscula, minúscula, número y '*.-_'`,
			incorrect_inputs: 'Nombre de usuario o contraseña incorrectos',
		}
	},
	{
		code: 'fr',
		flag: '🇫🇷',
		label: 'Français',
		translations: {
			login_welcome: 'Bienvenue !',
			login_username: `Nom d'utilisateur`,
			login_password: 'Mot de passe',
			login_sign_in: 'Se connecter',
			login_or: 'ou',
			login_forgot_password: 'Mot de passe oublié ?',
			login_no_account: `Vous n'avez pas de compte ? `,
			login_sign_up: `&nbsp;Inscrivez-vous`,
			login_create_account: 'Enregistrement',
			login_repeat_password: 'Répète le mot de passe',
			login_example_username: 'utilisateur-exemple123',
			login_example_email: 'exemple@email.fr',
			login_create: 'Creez-vous un compte',
			login_return_to: 'ou returnez au&nbsp;',
			login_accept_terms: `En vous inscrivant, vous acceptez nos conditions d'utilisation relatives à la protection de la vie privée.`,
			terms_policy: 'Conditions et Politique de confidentialité',
			language: 'Français',
			fill_all_fields: 'Remplir tous les champs',
			username_too_short: `Nom d'utilisateur trop court`,
			username_too_long: `Nom d'utilisateur trop long (max 16 caractères)`,
			username_allowed_chars: `Le nom d'utilisateur ne peut contenir que des minuscules et des traits de soulignement`,
			passwords_not_match : `Les mots de passe ne correspondent pas`,
			password_too_short : 'Mot de passe trop court',
			password_musts : `Veuillez utiliser au moins une majuscule, une minuscule, un chiffre et '*.-_'`,
		}
	},
];

const navigatorLanguage = 'es';

let lang = locales.find(lang => lang.code === navigatorLanguage)
						? navigatorLanguage
						: 'en';

export function applyTranslation() {
	const translations = locales.find(e => e.code === lang)?.translations;

	// localStorage.setItem("") = lang;

	const nodes = document.querySelectorAll('[translatekey]');
	const formNodes = document.querySelectorAll('[data-placeholder]');

	if (!nodes) return;

	nodes?.forEach((node) => {
		const key = node.getAttribute('translatekey');
		const translation = translations[key] || key;
		node.innerHTML = translation;
	});
	formNodes?.forEach((node) => {
		const key = node.getAttribute('data-placeholder');
		const translation = translations[key] || key;
		node.setAttribute('placeholder', translation);
	});
}

function generateLanguageSelector() {
	const container = document.querySelector('#languageSelector');

	if (!container) return;

	locales.forEach((locale) => {locales.find(e => e.code === lang)?.translations
		const element = document.createElement('button');
		element.className = 'dropdown-item';
		element.type = 'button';
		element.innerHTML = `${locale.flag} ${locale.label}`;
		element.onclick = () => {
			lang = locale.code;
			applyTranslation();
		}
		container.appendChild(element);
	});
}

export function getTranslation(key: string) {
	const translation = locales.find(e => e.code === lang).translations[key];
	return (translation || key);
}