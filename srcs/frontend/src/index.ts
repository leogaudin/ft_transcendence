import { initHomeEvents } from "./home-page/home-page.js";
import { initLoginEvents } from "./login-page/login-page.js";
import { initMessagesEvents, socketChat } from "./messages/messages-page.js";
import { initResetPasswordEvents } from "./reset-password-page/reset-password.js";
import { initTwoFactorEvents } from "./two-factor-page/two-factor.js";
import { initFriendsEvents } from "./friends/friends-page.js"
import { initSettingsEvents } from "./settings-page/settings-page.js"
import { LoginObject, MessageObject, Games, User } from "./types.js";
import { displayToast, createsocketToastConnection, socketToast } from "./toast-alert/toast-alert.js";
import { classicPong } from "./games/pong/classicPong.js"
import { chaosPong } from "./games/pong/chaosPong.js";
import { classicMode } from "./games/connectFour/classicMode.js";
import { crazyTokensMode } from "./games/connectFour/crazyTknsMode.js";
import { initTournamentEvents } from "./tournament/tournament.js";
import { initSelectPageEvent } from "./games/select-game-page.js";
import { initModifyPageEvents } from "./modify-profile/modify-page.js";
import { initStatsEvents } from "./statistics/stats-page.js";

const routes = [
	{
		path: "/",
		url: "",
		event: () => {}
	},
	{
		path: "/home",
		url: "../src/home-page/home-page.html",
		event: () => {
			initHomeEvents();
		}
	},
	{
		path: "/login",
		url: "../src/login-page/login-page.html",
		event: () => {
			initLoginEvents()
		}
	},
	{
		path: "/reset-password",
		url: "../src/reset-password-page/reset-password.html",
		event: () => {
			initResetPasswordEvents()
		}
	},
	{
		path: "/two-factor",
		url: "../src/two-factor-page/two-factor.html",
		event: (data: object) => {
			initTwoFactorEvents(data as LoginObject);
		}
	},
	{
		path: "/messages",
		url: "../src/messages/messages-page.html",
		event: (data: object) => {
			initMessagesEvents(data as MessageObject);
		}
	},
	{
		//cambios para implementar la opcion de menu al seleccionar los juegos
		path: "/games",
		url: "../src/games/select-game-page.html",
		event: () => {
			initSelectPageEvent();
		}
	},
	{
		path: "/friends",
		url: "../src/friends/friends-page.html",
		event: (data: object) => {
			initFriendsEvents(data as User);
		}
	},
	{
		path: "/statistics",
		url: "../src/statistics/statistics-page.html",
		event: () => {
			initStatsEvents();
		}
	},
	{
		path: "/settings",
		url: "../src/settings-page/settings-page.html",
		event: () => {
			initSettingsEvents();
		}
	},
	{
		path: "/modify-profile",
		url: "../src/modify-profile/modify-page.html",
		event: () => {
			initModifyPageEvents();
		}
	},
	{
		path: "/tournament",
		url: "../src/tournament/tournament.html",
		event: () => {
			initTournamentEvents();
		}
	},
	{
    	path: "/pong",
    	url: "../src/games/pong/pong.html",
    	event: (data: object) => {
      		const mode = data as Games;
			if (!mode.isCustom)
      			classicPong(mode);
			else
				chaosPong(mode)
    	}
	},
 	{
		path: "/4inrow",
    	url: "../src/games/connectFour/connectFour.html",
    	event: (data: object) => {
			const mode = data as Games;
			if (!mode.isCustom)
      			classicMode(mode);
			else
				crazyTokensMode(mode)
    	}
	},
	{
		path: "/404",
    	url: "../src/404/404-page.html",
    	event: () => {}
	},
];

export function navigateTo(path: string, data: object = {}) {
    let route = routes.find(r => r.path === path);
    if (!route) {
        path = "/404";
        route = routes.find(r => r.path === "/404");
    }
        
    if (route) {
        const screen = document.getElementsByClassName("screen-set")[0];
        if (screen) {
          screen.classList.add("fade-out");

          setTimeout(() => {
            history.pushState({}, "", path);
            if (socketToast && path === "/login")
              socketToast.close();
            loadContent(path, data);
          }, 150); 
        } 
        else {
          history.pushState({}, "", path);
          if (socketToast && path === "/login")
            socketToast.close();
          loadContent(path, data);
        }
    }
}

async function loadContent(path: string, data: object = {}) {
    try {
        let route = routes.find(r => r.path === path);
        if (!route || route === undefined) {
            route = routes.find(r => r.path === "/404");
            if (!route)
                throw "404 route not defined";
        }
        
        if (route.url) {
            const response = await fetch(route.url);
            const content = await response.text();
            const app = document.getElementById("app");
            if (app)
                app.innerHTML = content;
        }
        
        route.event(data);
    }
    catch (error) {
        console.error("Error:", error);
    }
}

async function initBaseEvents() {
	try {
		const response = await fetch("../src/toast-alert/toast-alert.html");
		const content = await response.text();
		const base = document.getElementById("base");
		if (base)
			base.innerHTML = content;
		displayToast();
	}
	catch (error) {
		console.error("Error while charging the page:", error);
	}
}

window.onpopstate = () => {
  if (socketChat)
    socketChat.close();
/* COmentario para ver el caso donde se vuelve desde la página pong o connect*/
/*   if (window.location.pathname.includes("/pong") || window.location.pathname.includes("/4inrow"))
	console.log("hola"); */
/*   else */
  	loadContent(window.location.pathname);
};

document.addEventListener("DOMContentLoaded", () => {
  initBaseEvents();
  
  const currentPath = window.location.pathname;
  const validRoute = routes.find(r => r.path === currentPath);
  
  if (!validRoute) {
    history.pushState({}, "", "/404");
    loadContent("/404");
  } else {
    if (currentPath !== "/login")
      createsocketToastConnection();
    loadContent(currentPath);
  }
});
