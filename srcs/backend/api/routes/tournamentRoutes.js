import { asyncHandler, validateInput } from "../utils.js";
import {
  createTournament,
  getTournamentByID,
  getTournaments,
  putTournament,
  patchTournament,
  deleteTournament,
} from "../models/tournamentModel.js";

const tournament_routes = [
  {
    method: "GET",
    url: "/tournaments",
    handler: asyncHandler(async (req, res) => {
      const tournaments = await getTournaments();
      res.code(200).send(tournaments);
    }),
  },
  {
    method: "POST",
    url: "/tournaments",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["name", "player_amount", "players"]))
        return;
      const tournament = await createTournament(req.body);
      res.code(201).send(tournament);
    }),
  },
  {
    method: "GET",
    url: "/tournaments/:id",
    handler: asyncHandler(async (req, res) => {
      const tournament = await getTournamentByID(req.params.id);
      res.code(200).send(tournament);
    }),
  },
  {
    method: "PUT",
    url: "/tournaments/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["name", "player_amount", "players"]))
        return;
      const tournament = await putTournament(req.params.id, req.body);
      res.code(200).send(tournament);
    }),
  },
  {
    method: "PATCH",
    url: "/tournaments/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, [])) return;
      const tournament = await patchTournament(req.params.id, req.body);
      res.code(200).send(tournament);
    }),
  },
  {
    method: "DELETE",
    url: "/tournaments/:id",
    handler: asyncHandler(async (req, res) => {
      await deleteTournament(req.params.id);
      res.code(204);
    }),
  },
];

export default tournament_routes;
