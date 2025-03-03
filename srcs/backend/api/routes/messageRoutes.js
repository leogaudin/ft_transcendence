import { asyncHandler, validateInput } from "../utils.js";
import {
  createMessage,
  getMessageByID,
  getMessages,
  putMessage,
  patchMessage,
  deleteMessage,
} from "../models/messageModel.js";

export default function createMessageRoutes(fastify) {
  return [
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/messages",
      handler: asyncHandler(async (req, res) => {
        const messages = await getMessages();
        return res.code(200).send(messages);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "POST",
      url: "/messages",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["sender_id", "chat_id", "body"])) return;
        const message = await createMessage(req.body);
        return res.code(201).send(message);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "GET",
      url: "/messages/:id",
      handler: asyncHandler(async (req, res) => {
        const message = await getMessageByID(req.params.id);
        return res.code(200).send(message);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PUT",
      url: "/messages/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, ["sender_id", "chat_id", "body"])) return;
        const message = await putMessage(req.params.id, req.body);
        return res.code(200).send(message);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "PATCH",
      url: "/messages/:id",
      handler: asyncHandler(async (req, res) => {
        if (!validateInput(req, res, [])) return;
        const message = await patchMessage(req.params.id, req.body);
        return res.code(200).send(message);
      }),
    },
    {
      onRequest: [fastify.authenticate],
      method: "DELETE",
      url: "/messages/:id",
      handler: asyncHandler(async (req, res) => {
        await deleteMessage(req.params.id);
        return res.code(204);
      }),
    },
  ];
}
