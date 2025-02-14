export default function createUploadRoutes(fastify) {
  return [
    {
      method: "POST",
      url: "/upload",
      handler: asyncHandler(async (req, res) => {
        // Do shit with the file
        const file = await req.file();
        // const data = await request.file();
        //
        //         if (!data) {
        //           return reply.code(400).send({ error: 'No file uploaded' });
        //         }
        //
        //         // Ensure uploads directory exists
        //         const uploadsDir = path.join(__dirname, '..', 'uploads');
        //
        //         // Generate unique filename
        //         const filename = `${Date.now()}-${data.filename}`;
        //         const filepath = path.join(uploadsDir, filename);
        //
        //         // Save file
        //         await pipeline(
        //           data.file,
        //           createWriteStream(filepath)
        //         );
        //
        //         return {
        //           message: "File uploaded successfully",
        //           fileDetails: {
        //             filename: filename,
        //             originalName: data.filename,
        //             mimetype: data.mimetype,
        //             size: data.file.bytesRead
        // }
        // };
      }),
    },
  ];
}
