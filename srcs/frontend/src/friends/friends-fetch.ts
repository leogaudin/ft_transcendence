import { UserMatches } from "../types.js"
import { sendRequest } from "../login-page/login-fetch";

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
			// for (let option of searchFriend.options) {
			//   if(option.value.toUpperCase().indexOf(text) > -1){
			// 	option.style.display = "block";
			// }else{
			//   option.style.display = "none";
			//   }
			// };
		
	}
}

async function showMatches(input: string) {
	console.log(input);

	const matches = await sendRequest('POST', '/users/search');
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