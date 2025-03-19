import createUserRoutes from "./userRoutes.js";
import createMatchRoutes from "./matchRoutes.js";
import createTournamentRoutes from "./tournamentRoutes.js";
import createMessageRoutes from "./messageRoutes.js";
import createChatRoutes from "./chatRoutes.js";
import createAuthRoutes from "./authorizationRoutes.js";
import createAvatarRoutes from "./avatarRoutes.js";
import createWebSocketsRoutes from "../sockets.js";

// Bundling all of the routes into one export

export default function createRoutes(fastify) {
  const userRoutes = createUserRoutes(fastify);
  const chatRoutes = createChatRoutes(fastify);
  const messageRoutes = createMessageRoutes(fastify);
  const matchRoutes = createMatchRoutes(fastify);
  const tournamentRoutes = createTournamentRoutes(fastify);
  const authRoutes = createAuthRoutes(fastify);
  const avatarRoutes = createAvatarRoutes(fastify);
  const socketsRoute = createWebSocketsRoutes(fastify);
  return [].concat(
    userRoutes,
    chatRoutes,
    messageRoutes,
    matchRoutes,
    tournamentRoutes,
    authRoutes,
    avatarRoutes,
    socketsRoute,
  );
}
