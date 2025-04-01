export function initFriendsEvents() {
	changeFriendPage();
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
		}
	});
	friendListButton.addEventListener("click", () => {
		if (friendListPage.style.display !== 'flex') {
			friendListPage.style.display = 'flex';
			invitationListPage.style.display = 'none';
		}
	});
}