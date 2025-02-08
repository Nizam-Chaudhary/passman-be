import multipart from "@fastify/multipart";
import { FastifyPluginAsync } from "fastify";

const fileUploadPlugin: FastifyPluginAsync = async (fastify, opts) => {
  await fastify.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fiel,
    },
  });
};

export default fileUploadPlugin;
