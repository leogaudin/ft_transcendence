import { asyncHandler, saveAvatar, UPLOAD_DIR } from "../utils.js";
import fs from "fs";
import path from "node:path";

export default function createAvatarRoutes(fastify) {
  return [
    {
      preHandler: [fastify.authenticate],
      method: "POST",
      url: "/avatars",
      handler: asyncHandler(async (req, res) => {
        const data = await req.file();
        if (!data) return res.code(400).send({ error: "No file uploaded" });
        const filename = `${Date.now()}-${data.filename}`;
        const result = await saveAvatar(req.userId, data, filename);
        return res.code(200).send(result);
      }),
    },
    {
      preHandler: [fastify.authenticate],
      method: "GET",
      url: "/avatars/:filename",
      handler: asyncHandler(async (req, res) => {
        const filename = req.params.filename;
        const filepath = path.join(UPLOAD_DIR, filename);
        if (!fs.existsSync(filepath))
          return res.code(404).send({ error: "Avatar not found" });
        const ext = path.extname(filename);
        const mimeTypes = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".gif": "image/gif",
          ".webp": "image/webp",
        };
        res.type(mimeTypes[ext] || "application/octet-stream");
        return res.sendFile(filename);
      }),
    },
  ];
}
