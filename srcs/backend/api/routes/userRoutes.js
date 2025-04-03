import { asyncHandler, validateInput } from "../utils.js";
import {
  createUser,
  getUser,
  getUsers,
  putUser,
  patchUser,
  deleteUser,
  removeUserFriend,
  addUserBlock,
  removeUserBlock,
  findMatchingUsers,
  addUserFriendPending,
  acceptUserFriend,
  getUserFriends,
  getFriendOfUser,
  getInvitationsOfUser,
} from "../models/userModel.js";
import { getMessagesOfUser } from "../models/messageModel.js";
import { getChatsOfUser } from "../models/chatModel.js";
import { getMatchesOfUser } from "../models/matchModel.js";
import { getTournamentsOfUser } from "../models/tournamentModel.js";

export default function createUserRoutes(fastify) {
  return [
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/users/list",
      handler: asyncHandler(async (req, res) => {
        const users = await getUsers();
        return res.code(200).send(users);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "password", "email"])) return;
        const user = await createUser(req.body);
        return res.code(201).send({
          success: true,
          id: user.id,
          username: user.username,
          email: user.email,
          // token: token,
        });
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        const user = await getUser(req.userId);
        return res.code(200).send(user);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "PUT",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["username", "password", "email"])) return;
        const user = await putUser(req.userId, req.body);
        return res.code(200).send(user);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "PATCH",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, [])) return;
        const user = await patchUser(req.userId, req.body);
        return res.code(200).send(user);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "DELETE",
      url: "/users",
      handler: asyncHandler(async (req, res) => {
        await deleteUser(req.userId);
        return res.code(204);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/users/:str",
      handler: asyncHandler(async (req, res) => {
        const table = req.params.str;
        var data;
        if (table == "messages") data = await getMessagesOfUser(req.userId);
        else if (table == "chats") data = await getChatsOfUser(req.userId);
        else if (table == "matches") data = await getMatchesOfUser(req.userId);
        else if (table == "tournaments")
          data = await getTournamentsOfUser(req.userId);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/users/search",
      handler: asyncHandler(async (req, res) => {
        const data = await findMatchingUsers(req.body.username, req.userId);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/users/friends",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["friend_id"])) return;
        const data = await addUserFriendPending(req.userId, req.body.friend_id);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/users/friends/confirm",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["friend_id"])) return;
        const data = await acceptUserFriend(req.userId, req.body.friend_id);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/users/friends",
      handler: asyncHandler(async (req, res) => {
        const data = await getUserFriends(req.userId);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/users/friends/:id",
      handler: asyncHandler(async (req, res) => {
        // Maybe add check if main user is friend with other user?
        const data = await getFriendOfUser(req.params.id);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "PATCH",
      url: "/users/friends",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["friend_id"])) return;
        const data = await removeUserFriend(req.userId, req.body.friend_id);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/users/invitations",
      handler: asyncHandler(async (req, res) => {
        const data = await getInvitationsOfUser(req.userId);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/users/blocks",
      handler: asyncHandler(async (req, res) => {
        console.log("Inside blocks:", req.body);
        if (!validateInput(req, res, ["blocked_id"])) return;
        await removeUserFriend(req.userId, req.body.blocked_id);
        const data = await addUserBlock(req.userId, req.body.blocked_id);
        return res.code(200).send(data);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "PATCH",
      url: "/users/blocks",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["blocked_id"])) return;
        const data = await removeUserBlock(req.userId, req.body.blocked_id);
        return res.code(200).send(data);
      }),
    },
  ];
}
