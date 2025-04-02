import { UserMatches } from "../types.js"
import { sendRequest } from "../login-page/login-fetch.js";

export function initFriendFetches() {
	const friendInput = document.getElementById("friend-input") as HTMLInputElement;
	const searchFriend = document.getElementById("search-friend") as any;
	
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
				option.innerHTML = `${matchesTyped[i].username}`;
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