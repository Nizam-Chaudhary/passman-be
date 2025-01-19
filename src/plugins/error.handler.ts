import { FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { FastifyInstance } from "fastify/types/instance";
import AppError from "../lib/appError";
import { globalErrorHandler } from "../lib/errorHandler";

export default fastifyPlugin(
  (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
    fastify.setErrorHandler(
      (error: AppError, request: FastifyRequest, reply: FastifyReply) => {
        globalErrorHandler(fastify, error, request, reply);
      }
    );

    done();
  }
);
