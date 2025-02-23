import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type AppError from "./appError";

import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";

import env from "./env";

export function globalErrorHandler(fastify: FastifyInstance,
  // biome-ignore lint/suspicious/noExplicitAny: error
  error: any, _request: FastifyRequest, reply: FastifyReply) {
  fastify.log.error(error);
  if (hasZodFastifySchemaValidationErrors(error)) {
    return sendSchemaValidationError(error, reply);
  }

  if (isResponseSerializationError(error)) {
    return sendResponseSerializationError(error, reply);
  }
  if (env.NODE_ENV === "development") {
    return sendErrorDev(error, reply);
  }
  sendErrorProd(error, reply);
}

// biome-ignore lint/suspicious/noExplicitAny: error
function sendSchemaValidationError(error: any, reply: FastifyReply) {
  const statusCode = 400;
  const message = "Request does not match the schema";
  reply.code(statusCode).send({
    status: "fail",
    message,
    issues: error.validation,
  });
}

// biome-ignore lint/suspicious/noExplicitAny: error
function sendResponseSerializationError(error: any, reply: FastifyReply) {
  const statusCode = 500;
  const message = "Response doesn't match the schema";
  reply.code(statusCode).send({
    status: "error",
    message,
    issues: error.cause.issues,
  });
}

function sendErrorDev(error: AppError, reply: FastifyReply) {
  const statusCode = error.statusCode || 500;
  const status
    = error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error";
  const message = error.message || "Internal Server Error";

  reply.code(statusCode).send({
    status,
    message,
    stack: error.stack,
  });
}

function sendErrorProd(error: AppError, reply: FastifyReply) {
  const statusCode = error.statusCode || 500;
  const status
    = error.statusCode >= 400 && error.statusCode < 500 ? "fail" : "error";
  const message = error.message || "Internal Server Error";

  if (error.isOperational) {
    return reply.code(statusCode).send({
      status,
      message,
    });
  }

  reply.code(statusCode).send({
    status: "error",
    message: "Internal Server Error",
  });
}
