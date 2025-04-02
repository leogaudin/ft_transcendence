
export function initFriendFetches() {
	console.log("Me inicializo bien");
	const friendInput = document.getElementById("friend-input") as HTMLInputElement;
	const searchFriend = document.getElementById("search-friend") as any;
	
	if (friendInput && searchFriend) {
		friendInput.onfocus = function () {
			console.log("Ay que me tocan los inpuses");
			searchFriend.style.display = 'block';
			friendInput.style.boxShadow = "0 0 0 max(100vh, 100vw) rgba(0, 0, 0, .3)";
			// friendInput.style.borderRadius = "5px 5px 0 0";
		  };
		  for (let option of searchFriend.options) {
			option.onclick = function () {
				console.log("Ay que me tocan las opsione");
				friendInput.value = option.value;
				searchFriend.style.display = 'none';
				friendInput.style.boxShadow = "";
			}
		  };
		  friendInput.oninput = function() {
			var text = friendInput.value.toUpperCase();
			for (let option of searchFriend.options) {
			  if(option.value.toUpperCase().indexOf(text) > -1){
				option.style.display = "block";
			}else{
			  option.style.display = "none";
			  }
			};
		  }
	}
}