import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type HttpError from "./httpError";

import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";

import env from "../config/env";

export function globalErrorHandler(
  fastify: FastifyInstance,
  error: any,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  fastify.log.error(error);
  if (hasZodFastifySchemaValidationErrors(error)) {
    sendSchemaValidationError(error, reply);
    return;
  }

  if (isResponseSerializationError(error)) {
    sendResponseSerializationError(error, reply);
    return;
  }

  sendFormattedResponse(error, reply);
}

function sendSchemaValidationError(error: any, reply: FastifyReply) {
  const statusCode = 422;
  const message = "Request does not match the schema";
  reply.code(statusCode).send({
    status: "fail",
    message,
    issues: error.validation,
  });
}

function sendResponseSerializationError(error: any, reply: FastifyReply) {
  const statusCode = 500;
  const message = "Response doesn't match the schema";
  reply.code(statusCode).send({
    status: "error",
    message,
    issues: error.cause.issues,
  });
}

function sendFormattedResponse(error: HttpError, reply: FastifyReply) {
  const statusCode = error?.statusCode ?? 500;
  const status =
    error?.statusCode >= 400 && error?.statusCode < 500 ? "fail" : "error";
  const message = error?.message ?? "Internal Server Error";

  if (error.isOperational || env.NODE_ENV === "development") {
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
