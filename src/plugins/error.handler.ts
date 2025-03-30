import type { FastifyReply, FastifyRequest } from "fastify";

import type HttpError from "../shared/lib/httpError.js";

import fastifyPlugin from "fastify-plugin";

import { globalErrorHandler } from "../shared/lib/errorHandler.js";

export default fastifyPlugin((fastify, _opts, done) => {
  fastify.setErrorHandler(
    (error: HttpError, request: FastifyRequest, reply: FastifyReply) => {
      globalErrorHandler(fastify, error, request, reply);
    }
  );

  done();
});
