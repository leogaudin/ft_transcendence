import { UserMatches } from "../types.js"
import { FriendList } from "../types.js"
import { sendRequest } from "../login-page/login-fetch.js";

export function initFriendFetches() {
	const friendInput = document.getElementById("friend-input") as HTMLInputElement;
	const searchFriend = document.getElementById("search-friend") as any;
	displayFriends();
	
	if (friendInput && searchFriend) {
		friendInput.onfocus = function () {
			searchFriend.style.display = 'block';
			friendInput.style.boxShadow = "0 0 0 max(100vh, 100vw) rgba(0, 0, 0, .3)";
		  };
		  for (let option of searchFriend.options) {
			option.onclick = function () {
				friendInput.value = option.value;
				searchFriend.style.display = 'none';
				friendInput.style.boxShadow = "";
			}
		  };
		  friendInput.oninput = debounce(() => {showMatches(friendInput.value)}, 500);
	}
}

function emptyMatches(datalist: HTMLElement) {
	var prevOptions = datalist.querySelectorAll(".match-option");
	if (prevOptions) {
		prevOptions.forEach((option) => {
			option.remove();
		})
	}
}

async function showMatches(input: string) {
	const datalist = document.getElementById("search-friend");

	if (datalist) {
		emptyMatches(datalist);
		if (!input || input.length === 0)
			return ;
	
		const matchesTyped = await sendRequest('POST', '/users/search', {username: input}) as UserMatches[];
		for(let i = 0, j = 0; (i < matchesTyped.length && i < 5) || j === 0; i++, j++) {
			var option;
			if (matchesTyped.length === 0) {
				option = document.createElement('p');
				option.innerText = "User Not Found";
			}
			else {
				option = document.createElement('option');
				if (matchesTyped[i].is_friend === 0) {
					option.innerHTML = `
					${matchesTyped[i].username}
					<svg id="accept-invitation" class="add-remove-icon add" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
						<path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/>
					</svg>
					`;
				}
				else if (matchesTyped[i].is_friend === 1) {
					option.innerHTML = `
					${matchesTyped[i].username}
					<svg xmlns="http://www.w3.org/2000/svg" class="add-remove-icon message" viewBox="0 -960 960 960">
						<path d="M880-80 720-240H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v560ZM160-473l47-47h393v-280H160v327ZM80-280v-520q0-33 23.5-56.5T160-880h440q33 0 56.5 23.5T680-800v280q0 33-23.5 56.5T600-440H240L80-280Zm80-240v-280 280Z"/>
					</svg>
					`
				}
				else {
					option.innerHTML = `
					${matchesTyped[i].username}
					<svg xmlns="http://www.w3.org/2000/svg" class="pending" viewBox="0 -960 960 960">
						<path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
					</svg>
					`
				}
				
			}
			option.setAttribute("class", "match-option");
			datalist.appendChild(option);
		}
	}
}

function debounce(callback: Function, wait: number) {
	let timerId: number | NodeJS.Timeout;;
	return (...args: Object[]) => {
	  clearTimeout(timerId);
	  timerId = setTimeout(() => {
		callback(...args);
	  }, wait);
	};
}

async function displayFriends() {
	const friendListPage = document.getElementById("friends-holder");
	const friendListTyped = await sendRequest('GET', 'users/friends') as FriendList[];
	if (!friendListTyped || !friendListPage)
		return;

	friendListTyped.forEach((friend) => {
		console.log("Estoy enseñando amigos, espero");
		const section = document.createElement("section");
		section.setAttribute("id", "friend-id");
		section.setAttribute("class", "friend-card");
		section.innerHTML = `
					<div class="flex items-center gap-4">
						<img id="friend-avatar" class="card-avatar rounded-full" src="../../resources/img/cat.jpg" alt="Avatar">
						<div class="flex flex-col">
							<h3>${friend.username}</h3>
							<p class="opacity-50 text-sm">${friend.status}</p>
						</div>
					</div>
					<div id="friend-status" class="flex gap-2 px-4">
						${friend.is_online === 1 ?
							'<p>Online</p><img src="../../resources/img/online.svg" alt="Online status">' :
							'<p>Offline</p><img src="../../resources/img/offline.svg" alt="Offline status">'
						}
					</div>
				`;
			friendListPage.appendChild(section);
		});
}