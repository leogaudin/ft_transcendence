import { moveToHome } from "../messages/messages-page.js"
import { initFriendFetches, displayInvitations, blockFriend } from "./friends-fetch.js"

export function initFriendsEvents() {
	moveToHome();
	changeFriendPage();
	initFriendFetches();
}

function changeFriendPage() {
	const friendListButton = document.getElementById("friend-list-page");
	const invitationListButton = document.getElementById("friend-invitation-page");
	const friendListPage = document.getElementById("friend-list");
	const invitationListPage = document.getElementById("invitation-list");
	if (!friendListButton || !invitationListButton || !friendListPage || !invitationListPage)
		return ;
	
	invitationListButton.addEventListener("click", () => {
		if (friendListPage.style.display !== 'none') {
			friendListPage.style.display = 'none';
			invitationListPage.style.display = 'flex';
			displayInvitations();
		}
	});
	friendListButton.addEventListener("click", () => {
		if (friendListPage.style.display !== 'flex') {
			friendListPage.style.display = 'flex';
			invitationListPage.style.display = 'none';
		}
	});
}

export function displayBlockPopUp(friendId: string) {
	const blockUser = document.getElementById("block-user") as HTMLDialogElement;
	const closeButton = document.getElementsByClassName("close-icon")[0] as HTMLButtonElement;
	const cancelButton = document.getElementsByClassName("cancel")[0] as HTMLButtonElement;
	const blockButton = document.getElementsByClassName("block")[0] as HTMLButtonElement;
	if (!blockUser || !closeButton || !cancelButton || !blockButton)
		return;
	blockUser.style.display = "flex";
	blockUser.showModal();

	closeButton.onclick = () => { closeModal(blockUser) };
    cancelButton.onclick = () => { closeModal(blockUser) };
    blockButton.onclick = () => { blockFriend(friendId) };
}


 
export function closeModal(modal: HTMLDialogElement) {
	modal.style.display = "none";
	modal.close();
}