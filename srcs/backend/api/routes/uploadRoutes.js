import { asyncHandler } from "../utils.js";
import { saveFile } from "../utils.js";

export default function createUploadRoutes(fastify) {
  return [
    {
      method: "POST",
      url: "/upload",
      handler: asyncHandler(async (req, res) => {
        const data = await req.file();
        if (!data) return res.code(400).send({ error: "No file uploaded" });
        const result = await saveFile(data);
        res.code(200).send(result);
      }),
    },
  ];
}
