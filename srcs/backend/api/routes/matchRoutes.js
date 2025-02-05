import { asyncHandler, validateInput } from "../utils.js";
import {
  getMatches,
  //   createMatch,
  //   getMatchByID,
  //   putMatch,
  //   patchMatch,
  //   deleteMatch,
} from "../models/matchModel.js";

const match_routes = [
  {
    method: "GET",
    url: "/matches",
    handler: asyncHandler(async (req, res) => {
      const matches = await getMatches();
      res.code(200).send(matches);
    }),
  },
  // {
  //   method: "POST",
  //   url: "/matches",
  //   handler: asyncHandler(async (req, res) => {
  //     const match = await createMatch(req.body);
  //     res.code(201).send(match);
  //   }),
  // },
  // {
  //   method: "GET",
  //   url: "/matches/:id",
  //   handler: asyncHandler(async (req, res) => {
  //     const match = await getMatchByID(req.params.id);
  //     if (!match) {
  //       return res.code(404).send({ error: "Match with ID not found." });
  //     }
  //     res.code(200).send(match);
  //   }),
  // },
  // {
  //   method: "PUT",
  //   url: "/matches/:id",
  //   handler: asyncHandler(async (req, res) => {
  //     const match = await putMatch(req.params.id, req.body);
  //     res.code(200).send(match);
  //   }),
  // },
  // {
  //   method: "PATCH",
  //   url: "/matches/:id",
  //   handler: asyncHandler(async (req, res) => {
  //     const match = await patchMatch(req.params.id, req.body);
  //     res.code(200).send(match);
  //   }),
  // },
  // {
  //   method: "DELETE",
  //   url: "/matches/:id",
  //   handler: asyncHandler(async (req, res) => {
  //     await deleteMatch(req.params.id);
  //     res.code(204);
  //   }),
  // },
];

export default match_routes;
