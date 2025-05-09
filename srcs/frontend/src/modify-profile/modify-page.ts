export function initModifyPageEvents() {
	const buttonId = document.getElementById('buttonid');
	if (buttonId) {
		buttonId.addEventListener('click', openDialog);
		function openDialog() {
			const fileId = document.getElementById('fileid');
			if (!fileId) { return ; }
			fileId.click();
		}
		const fileId = document.getElementById('fileid');
		if (!fileId) { return ; }
		fileId.addEventListener('change', submitForm);
        function submitForm() {
			const formId = document.getElementById('formid') as HTMLFormElement;
			if (!formId) { return; }
			console.log("Estoy subiendo técnicamente un archivo");
		    // formId.submit();
        }
	}

	
	const modifyIcons = document.getElementsByClassName("edit-icon") as HTMLCollectionOf<HTMLButtonElement>;
	if (!modifyIcons) { return ; }
	modifyIcons[0].onclick = () => { toggleNickForm(); };
	modifyIcons[1].onclick = () => { toggleDescriptionForm(); };	
}

function toggleNickForm() {
	const nickForm = document.getElementById("nick-form") as HTMLFormElement;
	const nickInput = document.getElementById("modify-nick") as HTMLInputElement;
	const nickSpan = document.getElementById("your-nick");
	if (!nickForm || !nickInput || !nickSpan) { return ; }

	console.log("Buenas tardes");
	if (nickForm.classList.contains('hidden')) {
		nickForm.classList.remove('hidden');
		nickSpan.classList.add('hidden');
	}
	nickForm.onsubmit = (e: Event) => {
		e.preventDefault();
		nickForm.classList.add('hidden');
		nickSpan.innerText = nickInput.value;
		nickSpan.classList.remove('hidden');
		// Call the function to save the nick changes
	}
}

function toggleDescriptionForm() {
	const descriptionForm = document.getElementById("description-form") as HTMLFormElement;
	const descriptionInput = document.getElementById("modify-description") as HTMLInputElement;
	const descriptionSpan = document.getElementById("your-description");
	if (!descriptionForm || !descriptionInput || !descriptionSpan) { return ; }

	if (descriptionForm.classList.contains('hidden')) {
		descriptionForm.classList.remove('hidden');
		descriptionSpan.classList.add('hidden');
	}
	descriptionForm.onsubmit = (e: Event) => {
		e.preventDefault();	
		descriptionForm.classList.add('hidden');
		descriptionSpan.innerText = descriptionInput.value;
		descriptionSpan.classList.remove('hidden');
		// Call the function to save description changes
	}
}