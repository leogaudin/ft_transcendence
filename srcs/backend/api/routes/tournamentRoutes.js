import { asyncHandler, validateInput } from "../utils.js";
import {
  createTournament,
  getTournamentByID,
  getTournaments,
  putTournament,
  patchTournament,
  deleteTournament,
} from "../models/tournamentModel.js";

export default function createTournamentRoutes(fastify) {
  return [
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/tournaments",
      handler: asyncHandler(async (req, res) => {
        const tournaments = await getTournaments();
        return res.code(200).send(tournaments);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/tournaments",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["name", "player_amount", "player_ids"]))
          return;
        const tournament = await createTournament(req.body);
        return res.code(201).send(tournament);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/tournaments/:id",
      handler: asyncHandler(async (req, res) => {
        const tournament = await getTournamentByID(req.params.id);
        return res.code(200).send(tournament);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PUT",
      url: "/tournaments/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["name", "player_amount", "player_ids"]))
          return;
        const tournament = await putTournament(req.params.id, req.body);
        return res.code(200).send(tournament);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/tournaments/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, [])) return;
        const tournament = await patchTournament(req.params.id, req.body);
        return res.code(200).send(tournament);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "DELETE",
      url: "/tournaments/:id",
      handler: asyncHandler(async (req, res) => {
        await deleteTournament(req.params.id);
        return res.code(204);
      }),
    },
  ];
}
