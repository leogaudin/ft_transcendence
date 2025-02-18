import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import createRoutes from "./routes/routes.js";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {});
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: "1d",
  },
});
// Add constraints to the file, like
// {
//    limits: {
// fieldNameSize: 100, // Max field name size in bytes
// fieldSize: 100,     // Max field value size in bytes
// fields: 10,         // Max number of non-file fields
// fileSize: 5000000,  // For multipart forms, the max file size in bytes (5MB)
// files: 1,
//
// }
await fastify.register(multipart);

fastify.decorate("authenticate", async function (req, res) {
  try {
    await req.jwtVerify();
  } catch (err) {
    res.send(err);
  }
});

const { ADDRESS = "0.0.0.0", PORT = "9000" } = process.env;

// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

const routes = createRoutes(fastify);

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

export default fastify;
