import user_routes from "./user-routes.js";
import match_routes from "./match-routes.js";
import tournament_routes from "./tournament-routes.js";
import message_routes from "./message-routes.js";
import chat_routes from "./chat-routes.js";

// Bundling all of the routes into one export
const routes = [].concat(
  user_routes,
  match_routes,
  tournament_routes,
  message_routes,
  chat_routes,
);

export default routes;
