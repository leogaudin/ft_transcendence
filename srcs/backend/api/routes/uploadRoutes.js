export default function createUploadRoutes(fastify) {
  return [
    {
      method: "POST",
      url: "/upload",
      handler: asyncHandler(async (req, res) => {
        // Do shit with the file
        const file = await req.file();
      }),
    },
  ];
}
