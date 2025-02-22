import type {
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyPlugin from "fastify-plugin";
import type { FastifyInstance } from "fastify/types/instance";
import type AppError from "../lib/appError";
import { globalErrorHandler } from "../lib/errorHandler";

export default fastifyPlugin((fastify, _opts, done) => {
  fastify.setErrorHandler(
    (error: AppError, request: FastifyRequest, reply: FastifyReply) => {
      globalErrorHandler(fastify, error, request, reply);
    }
  );

  done();
});
