import { asyncHandler, validateInput } from "../utils.js";
import {
  createUser,
  getUserByID,
  getUsers,
  putUser,
  patchUser,
  deleteUser,
  addUserFriend,
  removeUserFriend,
  addUserBlock,
  removeUserBlock,
} from "../models/userModel.js";
import { getMessagesOfUser } from "../models/messageModel.js";
import { getChatsOfUser } from "../models/chatModel.js";
import { getMatchesOfUser } from "../models/matchModel.js";
import { getTournamentsOfUser } from "../models/tournamentModel.js";

export default function createUserRoutes(fastify) {
  return [
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/users/list",
      handler: asyncHandler(async (req, res) => {
        const users = await getUsers();
        res.code(200).send(users);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "password", "email"])) return;
        const user = await createUser(req.body);
        res.code(201).send({
          id: user.id,
          username: user.username,
          email: user.email,
          // token: token,
        });
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        const user = await getUserByID(req.userId);
        res.code(200).send(user);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PUT",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "password", "email"])) return;
        const user = await putUser(req.userId, req.body);
        res.code(200).send(user);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, [])) return;
        const user = await patchUser(req.userId, req.body);
        res.code(200).send(user);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "DELETE",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        await deleteUser(req.userId);
        res.code(204);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/users/:str",
      handler: asyncHandler(async (req, res) => {
        const table = req.params.str;
        var data;
        if (table == "messages") {
          data = await getMessagesOfUser(req.userId);
        }
        if (table == "chats") {
          data = await getChatsOfUser(req.userId);
        }
        if (table == "matches") {
          data = await getMatchesOfUser(req.userId);
        }
        if (table == "tournaments") {
          data = await getTournamentsOfUser(req.userId);
        }
        res.code(200).send(data);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/users/friends",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["friend_id"])) return;
        const data = await addUserFriend(req.userId, req.body.friend_id);
        res.code(200).send(data);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/users/friends",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["friend_id"])) return;
        const data = await removeUserFriend(req.userId, req.body.friend_id);
        res.code(200).send(data);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/users/blocks",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["blocked_id"])) return;
        const data = await addUserBlock(req.userId, req.body.blocked_id);
        res.code(200).send(data);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/users/blocks",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["blocked_id"])) return;
        const data = await removeUserBlock(req.userId, req.body.blocked_id);
        res.code(200).send(data);
      }),
    },
  ];
}
