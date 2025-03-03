import { asyncHandler, validateInput } from "../utils.js";
import {
  createChat,
  getChatByID,
  getChats,
  putChat,
  patchChat,
  deleteChat,
} from "../models/chatModel.js";

export default function createChatRoutes(fastify) {
  return [
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/chats",
      handler: asyncHandler(async (req, res) => {
        const chats = await getChats();
        return res.code(200).send(chats);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/chats",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["first_user_id", "second_user_id"]))
          return;
        const chat = await createChat(req.body);
        return res.code(201).send(chat);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/chats/:id",
      handler: asyncHandler(async (req, res) => {
        const chat = await getChatByID(req.params.id);
        return res.code(200).send(chat);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PUT",
      url: "/chats/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["first_user_id", "second_user_id"]))
          return;
        const chat = await putChat(req.params.id, req.body);
        return res.code(200).send(chat);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/chats/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, [])) return;
        const chat = await patchChat(req.params.id, req.body);
        return res.code(200).send(chat);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "DELETE",
      url: "/chats/:id",
      handler: asyncHandler(async (req, res) => {
        await deleteChat(req.params.id);
        return res.code(204);
      }),
    },
  ];
}
