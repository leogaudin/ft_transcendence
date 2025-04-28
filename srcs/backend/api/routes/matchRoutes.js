import { asyncHandler, validateInput } from "../utils.js";
import { createMatch, getMatch, finishMatch } from "../models/matchModel.js";

import {
  noMoreMatchesInTournament,
  finishedMatchesInTournament,
  getTournamentByID,
  determineSecondBracket,
  determineFinalStandings,
  finishTournament,
} from "../models/tournamentModel.js";

export default function createMatchRoutes(fastify) {
  return [
    {
      //TODO: Add more endpoints to the matches:
      //      GET match/:id
      //      GET match (all)
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/matches",
      handler: asyncHandler(async (req, res) => {
        if (
          !validateInput(req, res, [
            "game_type",
            "first_player_id",
            "second_player_id",
          ])
        )
          return;
        const match = await createMatch(req.body);
        return res.code(201).send(match);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/matches/end",
      handler: asyncHandler(async (req, res) => {
        if (
          !validateInput(req, res, [
            "first_player_score",
            "second_player_score",
            "match_id",
          ])
        )
          return;
        const match = await getMatch(req.body.match_id);
        if (!match) return res.code(400).send({ error: "Match not found" });
        const result = await finishMatch(
          match,
          req.body.first_player_score,
          req.body.second_player_score,
        );
        const tour = await getTournamentByID(match.tournament_id);
        if (tour && (await noMoreMatchesInTournament(tour.tournament_id))) {
          if ((await finishedMatchesInTournament(tour.tournament_id)) === 4) {
            const standings = await determineFinalStandings(tour);
            await finishTournament(tour, standings);
          } else {
            const matches = await determineSecondBracket(tour);
          }
        }
        //TODO: figure out if splitting the endpoint is needed + what to return
        return res.code(200).send(result);
      }),
    },
  ];
}
