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

	const avatarOptions = document.getElementsByClassName("avatar-option") as HTMLCollectionOf<HTMLImageElement>
	if (!avatarOptions) { return ; }
	for (let option of avatarOptions) {
		option.addEventListener('click', () => {
			setOption(option.getAttribute('src'));
		});
	}
	
	const modifyIcons = document.getElementsByClassName("edit-icon") as HTMLCollectionOf<HTMLButtonElement>;
	if (!modifyIcons) { return ; }
	modifyIcons[0].onclick = () => { toggleNickForm(); };
	modifyIcons[1].onclick = () => { toggleDescriptionForm(); };	

	initCanvas();
}

let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;

function initCanvas() {
    canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }
    context = canvas.getContext('2d');
    make_base();
}

function setOption(src: string | null) {
    console.log(src);
    if (!src) { return };
    
    let image = new Image();
    image.src = src;
    image.onload = function() {
        if (context && canvas) {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }
}

function make_base(){
    if (!context) return;
    
    let base_image = new Image();
    base_image.src = 'img/base.png';
    base_image.onload = function() {
        if (context && canvas) {
            context.drawImage(base_image, 0, 0);
        }
    }
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