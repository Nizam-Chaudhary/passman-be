import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import userController from "../controllers/user";
import {
  getUserResponseSchema,
  refreshTokenBodySchema,
  refreshTokenResponseSchema,
  signInResponseSchema,
  signInUserSchema,
  signUpUserResponseSchema,
  signUpUserSchema,
  updateUserResponseSchema,
  updateUserSchema,
  verifyUserEmailBodySchema,
} from "../schemas/user";
import { errorSchema, responseSchema } from "../utils/basicSchema";

export default async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/sign-up",
    schema: {
      tags: ["Auth"],
      summary: "Sign up user",
      description: "Sign up user",
      body: signUpUserSchema,
      response: {
        200: signUpUserResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
      required: ["email"],
    },
    handler: userController.signUpUser,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/sign-in",
    schema: {
      tags: ["Auth"],
      summary: "Sign in user",
      description: "Sign in user",
      body: signInUserSchema,
      response: {
        200: signInResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    handler: userController.signInUser,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/refresh-token",
    schema: {
      tags: ["Auth"],
      summary: "Refresh access token",
      body: refreshTokenBodySchema,
      description: "Refresh access token",
      response: {
        200: refreshTokenResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    handler: userController.refreshToken,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/verify",
    schema: {
      tags: ["Auth"],
      summary: "Verify user email",
      description: "Verify user email",
      body: verifyUserEmailBodySchema,
      response: {
        200: responseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    handler: userController.verifyUserEmail,
  });

  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/update",

    schema: {
      tags: ["User"],
      summary: "Update user details",
      description: "update user details",
      security: [{ jwtAuth: [] }],
      body: updateUserSchema,
      response: {
        200: updateUserResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
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
        200: getUserResponseSchema,
        "4xx": errorSchema,
        "5xx": errorSchema,
      },
    },
    preHandler: [fastify.authenticate],
    handler: userController.getUser,
  });
};
