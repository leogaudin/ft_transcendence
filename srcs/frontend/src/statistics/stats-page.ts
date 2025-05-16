import { moveToHome } from "../messages/messages-page.js";
import { initStatsFetch } from "./stats-fetch.js";

export function initStatsEvents() {
	moveToHome();
	initStatsFetch();
}
