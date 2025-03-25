import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import fileController from "@/modules/file/file.controller.js";
import { uploadFileResponseSchema } from "@/modules/file/file.schema.js";
import { errorSchema } from "@/utils/basicSchema.js";
import { z } from "zod";

export default async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/upload",
    attachValidation: true,
    schema: {
      tags: ["Files"],
      summary: "Upload file",
      description: "Upload file",
      security: [{ jwtAuth: [] }],
      body: z.object({ file: z.string() }),
      consumes: ["multipart/form-data"],
      response: {
        "200": uploadFileResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: fileController.uploadFile,
  });
};
