import user_routes from "./userRoutes.js";
import match_routes from "./matchRoutes.js";
import tournament_routes from "./tournamentRoutes.js";
import message_routes from "./messageRoutes.js";
import chat_routes from "./chatRoutes.js";
import auth_routes from "./authorizationRoutes.js";

// Bundling all of the routes into one export
const routes = [].concat(
  user_routes,
  match_routes,
  tournament_routes,
  message_routes,
  chat_routes,
  auth_routes,
);

export default routes;
