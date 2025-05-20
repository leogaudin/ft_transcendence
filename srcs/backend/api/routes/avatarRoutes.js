import { asyncHandler, saveAvatar } from "../utils.js";
import { getUser } from "../models/userModel.js";

export default function createAvatarRoutes(fastify) {
  return [
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/avatars",
      handler: asyncHandler(async (req, res) => {
        const data = await req.file();
        if (!data) return res.code(400).send({ error: "No file uploaded" });
        const allowedMimeTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedMimeTypes.includes(data.mimetype))
          return res.code(400).send({ error: "Invalid file type" });
        const maxSize = 1024 * 1024;
        if (data.file.bytesRead > maxSize)
          return res.code(400).send({ error: "File too large (max 1MB)" });
        let result;
        try {
          result = await saveAvatar(req.userId, data);
        } catch (e) {
          return res.code(400).send({ error: "Invalid or corrupt file" });
        }
        return res.code(200).send(result);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/avatars",
      handler: asyncHandler(async (req, res) => {
        const userId = req.userId;
        const user = await getUser(userId);
        if (!user) return res.code(404).send({ error: "User not found" });
        return res.code(200).send({ avatar: user.avatar });
      }),
    },
  ];
}
