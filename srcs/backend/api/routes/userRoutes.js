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
} from "../models/userModel.js";
import { getMessagesOfUser } from "../models/messageModel.js";
import { getChatsOfUser } from "../models/chatModel.js";
import { getMatchesOfUser } from "../models/matchModel.js";
import { getTournamentsOfUser } from "../models/tournamentModel.js";

export default function createUserRoutes(fastify) {
  return [
    {
      method: "POST",
      url: "/upload",
      preHandler: fastify.upload.single("avatar"),
      handler: asyncHandler(async (req, res) => {
        const file = req.file;
        return {
          message: "File uploaded successfully",
          fileDetails: {
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          },
        };
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/users",
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
      url: "/users/:id",
      handler: asyncHandler(async (req, res) => {
        const user = await getUserByID(req.params.id);
        res.code(200).send(user);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PUT",
      url: "/users/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "password", "email"])) return;
        const user = await putUser(req.params.id, req.body);
        res.code(200).send(user);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/users/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, [])) return;
        const user = await patchUser(req.params.id, req.body);
        res.code(200).send(user);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "DELETE",
      url: "/users/:id",
      handler: asyncHandler(async (req, res) => {
        await deleteUser(req.params.id);
        res.code(204);
      }),
    },
    {
      onRequest: [fastify.authenticate],
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
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/users/:id/friends",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["friend_id"])) return;
        const data = await addUserFriend(req.params.id, req.body.friend_id);
        res.code(200).send(data);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/users/:id/friends",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["friend_id"])) return;
        const data = await removeUserFriend(req.params.id, req.body.friend_id);
        res.code(200).send(data);
      }),
    },
  ];
}
