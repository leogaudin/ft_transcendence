import { asyncHandler, validateInput } from "../utils.js";
import {
  createChat,
  getChatByID,
  getChats,
  putChat,
  patchChat,
  deleteChat,
} from "../models/chatModel.js";

const chat_routes = [
  {
    method: "GET",
    url: "/chats",
    handler: asyncHandler(async (req, res) => {
      const chats = await getChats();
      res.code(200).send(chats);
    }),
  },
  {
    method: "POST",
    url: "/chats",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["first_user_id", "second_user_id"])) return;
      const chat = await createChat(req.body);
      res.code(201).send(chat);
    }),
  },
  {
    method: "GET",
    url: "/chats/:id",
    handler: asyncHandler(async (req, res) => {
      const chat = await getChatByID(req.params.id);
      res.code(200).send(chat);
    }),
  },
  {
    method: "PUT",
    url: "/chats/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["first_user_id", "second_user_id"])) return;
      const chat = await putChat(req.params.id, req.body);
      res.code(200).send(chat);
    }),
  },
  {
    method: "PATCH",
    url: "/chats/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, [])) return;
      const chat = await patchChat(req.params.id, req.body);
      res.code(200).send(chat);
    }),
  },
  {
    method: "DELETE",
    url: "/chats/:id",
    handler: asyncHandler(async (req, res) => {
      await deleteChat(req.params.id);
      res.code(204);
    }),
  },
];

export default chat_routes;
