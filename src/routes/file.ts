import { MulterError } from "@fastify/multipart";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const uploadFileSchema = z.object({
  file: z.any(),
});

export default async function file(app: FastifyInstance) {
  // Register multer with the app


  // Register the upload route with Fastify
  app.post(
    "/upload",
    {
      schema: {
        body: uploadFileSchema,
      },
      preHandler: app.fastifyMulter.array("file"), // Use the array form for multiple file uploads
    },
    async (req, reply) => {
      try {
        // The file data is available in req.raw.files
        const files = req.raw.files;

        if (!files || !Array.isArray(files)) {
          throw new Error("No files were uploaded");
        }

        // Process each file using the Type entity provider or any other logic here
        for (const file of files) {
          try {
            console.log(`Processing file: ${file.filename}`);

            // Replace this with your actual processing logic
            await new Promise((resolve, reject) => {
              setTimeout(resolve, 1000);
            });

            console.log("File processed successfully");
          } catch (error) {
            console.error(`Error processing file: ${file.filename}, ${error}`);
          }
        }

        // Respond with a success message
        reply.status(200).send({ message: "Files uploaded successfully" });
      } catch (error) {
        if (error instanceof MulterError) {
          throw app.httpErrors.badRequest("Multer error:", error);
        }

        console.error(`Failed to upload files, ${error}`);

        reply.status(500).send({ message: "Failed to upload files" });
      }
    }
  );
}
