import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { container } from "tsyringe";
import { errorResponseSchema } from "../../../../shared/schemas/responseSchemas";
import { UserController } from "../controllers/userController";
import {
  createUserSchema,
  getUserResponseSchema,
  signUpUserResponseSchema,
  updateUserResponseSchema,
  updateUserSchema,
} from "../schemas/userSchema";

export default async (fastify: FastifyInstance) => {
  const userController = container.resolve(UserController);
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/sign-up",
    schema: {
      tags: ["User"],
      summary: "Sign up user",
      description: "Sign up user",
      body: createUserSchema,
      response: {
        "200": signUpUserResponseSchema,
        "4xx": errorResponseSchema,
        "5xx": errorResponseSchema,
      },
      required: ["email"],
    },
    handler: userController.createUser,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/",
    schema: {
      tags: ["User"],
      summary: "Update user details",
      description: "update user details",
      security: [{ jwtAuth: [] }],
      body: updateUserSchema,
      response: {
        "200": updateUserResponseSchema,
        "4xx": errorResponseSchema,
        "5xx": errorResponseSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: userController.updateUser,
  });
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      security: [{ jwtAuth: [] }],
      tags: ["User"],
      summary: "Get logged in user detail",
      description: "fetch user details",
      response: {
        "200": getUserResponseSchema,
        "4xx": errorResponseSchema,
        "5xx": errorResponseSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: userController.getUser,
  });
};
