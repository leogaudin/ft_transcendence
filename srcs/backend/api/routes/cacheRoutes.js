import { asyncHandler, validateInput } from "../utils.js";

export default function createCacheRoutes(fastify) {
  return [
    {
      // preHandler: [fastify.authenticate],
      method: "POST",
      url: "/gamestate",
      handler: asyncHandler(async (req, res) => {
        //Cosas de guardar
        //         fastify.post('/gamestate', async (request, reply) => {
        //   const { gameId, state } = request.body;
        //
        //   if (!gameId || !state) {
        //     return reply.code(400).send({ error: 'Game ID and state are required' });
        //   }
        //
        //   try {
        //     // TTL in seconds (optional)
        //     const ttl = request.body.ttl || 3600;
        //
        //     // Store the game state
        //     await fastify.cache.set(`game:${gameId}`, JSON.stringify(state), ttl);
        //
        //     return { success: true };
        //   } catch (err) {
        //     request.log.error(err);
        //     return reply.code(500).send({ error: 'Failed to save game state' });
        //   }
        // });
      }),
    },
    {
      // preHandler: [fastify.authenticate],
      method: "GET",
      url: "/gamestate/:id",
      handler: asyncHandler(async (req, res) => {
        // const id = req.params.id;
        //Cosas de gettear
        //
        // fastify.get('/gamestate/:id', async (request, reply) => {
        //   const gameId = request.params.id;
        //
        //   try {
        //     const result = await fastify.cache.get(`game:${gameId}`);
        //
        //     if (!result || !result.value) {
        //       return reply.code(404).send({ error: 'Game state not found' });
        //     }
        //
        //     // Parse the stored state
        //     const state = JSON.parse(result.value);
        //
        //     return { gameId, state };
        //   } catch (err) {
        //     request.log.error(err);
        //     return reply.code(500).send({ error: 'Failed to retrieve game state' });
        //   }
        // });
      }),
    },
    {
      // preHandler: [fastify.authenticate],
      method: "DELETE",
      url: "/gamestate/:id",
      handler: asyncHandler(async (req, res) => {
        // const id = req.params.id;
        //Cosas de borrar
        //fastify.delete('/gamestate/:id', async (request, reply) => {
        //   const gameId = request.params.id;
        //
        //   try {
        //     await fastify.cache.del(`game:${gameId}`);
        //     return { success: true };
        //   } catch (err) {
        //     request.log.error(err);
        //     return reply.code(500).send({ error: 'Failed to delete game state' });
        //   }
        // });
      }),
    },
  ];
}
