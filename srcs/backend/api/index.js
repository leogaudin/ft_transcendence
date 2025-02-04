import Fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./routes/routes.js";

const fastify = Fastify({ logger: true });
await fastify.register(cors, {});

const { ADDRESS = "0.0.0.0", PORT = "9000" } = process.env;

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

routes.forEach((route) => {
  fastify.route(route);
});

// Run the server!
try {
  await fastify.listen({ host: ADDRESS, port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
