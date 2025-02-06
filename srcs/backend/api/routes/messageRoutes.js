import { asyncHandler, validateInput } from "../utils.js";
import {
  createMessage,
  getMessageByID,
  getMessages,
  putMessage,
  patchMessage,
  deleteMessage,
} from "../models/messageModel.js";

const message_routes = [
  {
    method: "GET",
    url: "/messages",
    handler: asyncHandler(async (req, res) => {
      const messages = await getMessages();
      res.code(200).send(messages);
    }),
  },
  {
    method: "POST",
    url: "/messages",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["sender_id", "chat_id", "body"])) return;
      const message = await createMessage(req.body);
      res.code(201).send(message);
    }),
  },
  {
    method: "GET",
    url: "/messages/:id",
    handler: asyncHandler(async (req, res) => {
      const message = await getMessageByID(req.params.id);
      res.code(200).send(message);
    }),
  },
  {
    method: "PUT",
    url: "/messages/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, ["sender_id", "chat_id", "body"])) return;
      const message = await putMessage(req.params.id, req.body);
      res.code(200).send(message);
    }),
  },
  {
    method: "PATCH",
    url: "/messages/:id",
    handler: asyncHandler(async (req, res) => {
      if (!validateInput(req, res, [])) return;
      const message = await patchMessage(req.params.id, req.body);
      res.code(200).send(message);
    }),
  },
  {
    method: "DELETE",
    url: "/messages/:id",
    handler: asyncHandler(async (req, res) => {
      await deleteMessage(req.params.id);
      res.code(204);
    }),
  },
];

export default message_routes;
