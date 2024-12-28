import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import userController from "../controllers/user";
import {
    getUserResponseSchema,
    signInUserSchema,
    signUpUserSchema,
    updateUserSchema,
} from "../schemas/user";
import { errorSchema, responseSchema } from "../utils/basicSchema";

export default async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/sign-up",
        schema: {
            tags: ["Auth"],
            description: "Sign up user",
            body: signUpUserSchema,
            response: {
                200: responseSchema,
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
            description: "Sign in user",
            body: signInUserSchema,
            response: {
                200: responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: userController.signInUser,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/update",

        schema: {
            tags: ["User"],
            description: "update user details",
            security: [{ cookieAuth: [] }],
            body: updateUserSchema,
            response: {
                200: responseSchema,
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
            security: [{ cookieAuth: [] }],
            tags: ["User"],
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

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "GET",
        url: "/logout",
        schema: {
            tags: ["Auth"],
            description: "Log out user",
            response: {
                200: responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        handler: userController.logout,
    });
};
