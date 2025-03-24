import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import formbody from "@fastify/formbody";
import createRoutes from "./routes/routes.js";
import websocket from "@fastify/websocket";

const fastify = Fastify({
  logger: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
        singleLine: true,
      },
    },
  },
});

/** Plugin registration */
await fastify.register(cors, {
  origin: "http://localhost:8000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: "1d",
  },
});
await fastify.register(multipart);
await fastify.register(formbody);
await fastify.register(websocket);

/** Decorator for JWT verification */
fastify.decorate("authenticate", async function (req, res) {
  try {
    await req.jwtVerify();
    const token = await req.jwtDecode();
    req.userId = token.user;
  } catch (err) {
    res.send(err);
  }
});
//zod comentar para ver la libreria
const { ADDRESS = "0.0.0.0", PORT = "9000" } = process.env;

/** Declares the routes */
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

const routes = createRoutes(fastify);
routes.forEach((route) => {
  fastify.route(route);
});

try {
  await fastify.listen({ host: ADDRESS, port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

export default fastify;
