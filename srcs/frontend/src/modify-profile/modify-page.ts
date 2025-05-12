import { navigateTo } from "../index.js"

export function initModifyPageEvents() {
	// Return Home
	const homeButton = document.getElementById("home-button");
	if (!homeButton) { return ;}
	homeButton.addEventListener('click', () => { returnHome(); })

	// Change Nick and Description
	const modifyIcons = document.getElementsByClassName("edit-icon") as HTMLCollectionOf<HTMLButtonElement>;
	if (!modifyIcons) { return ; }
	modifyIcons[0].onclick = () => { toggleNickForm(); };
	modifyIcons[1].onclick = () => { toggleDescriptionForm(); };	

	// Upload photos buttons
	const buttonId = document.getElementById('buttonid');
	const fileId = document.getElementById('fileid');
	if (!buttonId || !fileId) {return ;}
	
	buttonId.addEventListener('click', openFileSelector);
	fileId.addEventListener('change', submitImage);

	// Create and modify avatar options
	initCanvas();
	const createAvatarButton = document.getElementById("create-avatar");
	if (!createAvatarButton) { return ; }
	createAvatarButton.onclick = () => { toggleAvatarEditor(); };

	const avatarOptions = document.getElementsByClassName("avatar-option") as HTMLCollectionOf<HTMLImageElement>
	if (!avatarOptions) { return ; }
	for (const option of avatarOptions) {
		option.addEventListener('click', () => {
			setOption(option.getAttribute('src'));
		});
	}

	// Responsivity
	const returnButton = document.getElementById("go-back");
	if (!returnButton) { return ; }
	returnButton.addEventListener('click', () => { toggleMobileDisplay(); })
	window.addEventListener("resize", changedWindowSize);
}

function returnHome() {
	for (let layer of layers)
		layer.src = "";
	navigateTo("/home");
}

function toggleNickForm() {
	const nickForm = document.getElementById("nick-form") as HTMLFormElement;
	const nickInput = document.getElementById("modify-nick") as HTMLInputElement;
	const nickSpan = document.getElementById("your-nick");
	if (!nickForm || !nickInput || !nickSpan) { return ; }

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

function openFileSelector() {
	const fileId = document.getElementById('fileid');
	if (fileId)
		fileId.click();
}

function submitImage() {
	const formId = document.getElementById('formid') as HTMLFormElement;
	if (!formId) { return; }
	console.log("I'm selecting an image");
	// formId.submit();
}

let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;
const layers = [
	{
		name: "background",
		src: ""
	},
	{
		name: "body",
		src: ""
	},
	{
		name: "eyes",
		src: ""
	},
	{
		name: "accessory",
		src: ""
	}
];

function initCanvas() {
    canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
	context = canvas.getContext('2d');
    if (!canvas || !context) {
        console.error("Canvas element not found");
        return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleAvatarEditor() {
	const avatarEditorPage = document.getElementById("avatar");
	const modifyProfilePage = document.getElementById("modify-dimensions");
	const saveChanges = document.getElementById("save-avatar");
	if (!avatarEditorPage || !saveChanges || !modifyProfilePage) { return ; }

	if (avatarEditorPage.classList.contains('hidden'))
		avatarEditorPage.classList.remove('hidden');
	if (window.innerWidth <= 1280)
			modifyProfilePage.classList.add('hidden');
	saveChanges.onclick = () => { console.log("Saving the canvas here"); };
}

function setOption(src: string | null) {
    if (!src) { return };

    for (let layer of layers) {
        if (src.includes(layer.name)) {
            layer.src = src;
            break ;
        }
    }
    redrawCanvas();
}

function redrawCanvas() {
    if (!context || !canvas) { return };

    context.clearRect(0, 0, canvas.width, canvas.height);
    const layerPromises = layers.map(layer => {
        return new Promise<void>((resolve) => {
            if (layer.src === "") {
                resolve();
                return;
            }
            
            const image = new Image();
            image.onload = () => {
                if (context && canvas)
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve();
            };
            image.onerror = () => {
                console.error(`Failed to load image: ${layer.src}`);
                resolve();
            };
            image.src = layer.src;
        });
    });
    
    // Wait for all images to load and be drawn in order
    Promise.all(layerPromises);
}

function toggleMobileDisplay() {
	const avatarPage = document.getElementById("avatar");
	const modifyProfilePage = document.getElementById("modify-dimensions");
	
	if (avatarPage && modifyProfilePage) {
		if (!modifyProfilePage.classList.contains('hidden')) {
			avatarPage.classList.remove('hidden');
			modifyProfilePage.classList.add('hidden');
		}
		else {
			avatarPage.classList.add('hidden');
			modifyProfilePage.classList.remove('hidden');
		}
	}
}

function changedWindowSize() {
	const avatarPage = document.getElementById("avatar");
	const modifyProfilePage = document.getElementById("modify-dimensions");

	if (avatarPage && modifyProfilePage) {
		if (window.innerWidth > 1280) {
			modifyProfilePage.classList.remove('hidden');
		}
		else {
			if (!modifyProfilePage.classList.contains('hidden'))
				avatarPage.classList.add('hidden');
			else {
				modifyProfilePage.classList.add('hidden');
				avatarPage.classList.remove('hidden');
			}
		  }
	}
}
