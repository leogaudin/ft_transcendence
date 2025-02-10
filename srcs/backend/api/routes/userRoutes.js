import { asyncHandler, validateInput } from "../utils.js";
import {
  createUser,
  getUserByID,
  getUsers,
  putUser,
  patchUser,
  deleteUser,
} from "../models/userModel.js";
import { getMessagesOfUser } from "../models/messageModel.js";
import { getChatsOfUser } from "../models/chatModel.js";
import { getMatchesOfUser } from "../models/matchModel.js";
import { getTournamentsOfUser } from "../models/tournamentModel.js";
import fastify from "../index.js";

/* TODO:
 * Send JWT on auth success - WIP
 * Endpoints to retrieve all of the messages, chats, tournaments and matches of a given player, ie. http://localhost:9000/users/:id/messages
 * Endpoint to change / reset password of users
 * Avatar handling and storage
 * Friend handling
 * Deleted user handling (make user anonymous)
 * Do not return the hashed password on get / list user - sort of done
 * */

const user_routes = [
  {
    method: "GET",
    url: "/users",
    handler: asyncHandler(async (req, res) => {
      const users = await getUsers();
      res.code(200).send(users);
    }),
  },
  {
    method: "POST",
    url: "/users",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["username", "password", "email"])) return;
      const user = await createUser(req.body);
      //TEST: Check implementation of JWT
      const token = fastify.jwt.sign(user);
      res.code(201).send({
        id: user.id,
        username: user.username,
        email: user.email,
        token: token,
      });
    }),
  },
  {
    method: "GET",
    url: "/users/:id",
    handler: asyncHandler(async (req, res) => {
      const user = await getUserByID(req.params.id);
      res.code(200).send(user);
    }),
  },
  {
    method: "PUT",
    url: "/users/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["username", "password", "email"])) return;
      const user = await putUser(req.params.id, req.body);
      res.code(200).send(user);
    }),
  },
  {
    method: "PATCH",
    url: "/users/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, [])) return;
      const user = await patchUser(req.params.id, req.body);
      res.code(200).send(user);
    }),
  },
  {
    method: "DELETE",
    url: "/users/:id",
    handler: asyncHandler(async (req, res) => {
      await deleteUser(req.params.id);
      res.code(204);
    }),
  },
  {
    method: "GET",
    url: "/users/:id/:str",
    handler: asyncHandler(async (req, res) => {
      const table = req.params.str;
      const id = req.params.id;
      var data;
      if (table == "messages") {
        data = await getMessagesOfUser(id);
      }
      if (table == "chats") {
        data = await getChatsOfUser(id);
      }
      if (table == "matches") {
        data = await getMatchesOfUser(id);
      }
      if (table == "tournaments") {
        data = await getTournamentsOfUser(id);
      }

      res.code(200).send(data);
    }),
  },
];

export default user_routes;
