import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import passwordController from "../controllers/password";
import {
  addOrUpdateOrDeletePasswordResponseSchema,
  addPasswordSchema,
  getPasswordResponseSchema,
  getPasswordsQueryStringSchema,
  getPasswordsResponseSchema,
  importPasswordResponseSchema,
  importPasswordsSchema,
  updatePasswordSchema,
} from "../schemas/password";
import { errorSchema, idParamsSchema } from "../utils/basicSchema";

export default async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["Password"],
      summary: "Add a new password",
      description: "add password",
      security: [{ jwtAuth: [] }],
      body: addPasswordSchema,
      response: {
        200: addOrUpdateOrDeletePasswordResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.addPassword,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Password"],
      summary: "Get all passwords",
      description: "fetch passwords",
      security: [{ jwtAuth: [] }],
      querystring: getPasswordsQueryStringSchema,
      response: {
        200: getPasswordsResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.getPasswords,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:id",
    schema: {
      tags: ["Password"],
      summary: "Get password by ID",
      description: "fetch password",
      security: [{ jwtAuth: [] }],
      params: idParamsSchema,
      response: {
        200: getPasswordResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.getPasswordById,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/:id",
    schema: {
      tags: ["Password"],
      summary: "Update password by ID",
      description: "update password",
      security: [{ jwtAuth: [] }],
      params: idParamsSchema,
      body: updatePasswordSchema,
      response: {
        200: addOrUpdateOrDeletePasswordResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.updatePassword,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: ["Password"],
      summary: "Delete password by ID",
      description: "delete password",
      security: [{ jwtAuth: [] }],
      params: idParamsSchema,
      response: {
        200: addOrUpdateOrDeletePasswordResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.deletePassword,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/import",
    schema: {
      tags: ["Password"],
      summary: "Import multiple passwords",
      description: "import passwords",
      security: [{ jwtAuth: [] }],
      body: importPasswordsSchema,
      response: {
        200: importPasswordResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: passwordController.importPasswords,
  });
};
