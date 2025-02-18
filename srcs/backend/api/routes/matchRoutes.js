import { asyncHandler, validateInput } from "../utils.js";
import {
  createMatch,
  getMatchByID,
  getMatchs,
  putMatch,
  patchMatch,
  deleteMatch,
} from "../models/matchModel.js";

export default function createMatchRoutes(fastify) {
  return [
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/matches",
      handler: asyncHandler(async (req, res) => {
        const matchs = await getMatchs();
        res.code(200).send(matchs);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/matches",
      handler: asyncHandler(async (req, res) => {
        if (
          !validateInput(req, res, [
            "right_player_id",
            "left_player_id",
            "result",
            "winner_id",
            "loser_id",
          ])
        )
          return;
        const match = await createMatch(req.body);
        res.code(201).send(match);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/matches/:id",
      handler: asyncHandler(async (req, res) => {
        const match = await getMatchByID(req.params.id);
        res.code(200).send(match);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PUT",
      url: "/matches/:id",
      handler: asyncHandler(async (req, res) => {
        if (
          !validateInput(req, res, [
            "right_player_id",
            "left_player_id",
            "result",
            "winner_id",
            "loser_id",
          ])
        )
          return;
        const match = await putMatch(req.params.id, req.body);
        res.code(200).send(match);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/matches/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, [])) return;
        const match = await patchMatch(req.params.id, req.body);
        res.code(200).send(match);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "DELETE",
      url: "/matches/:id",
      handler: asyncHandler(async (req, res) => {
        await deleteMatch(req.params.id);
        res.code(204);
      }),
    },
  ];
}
