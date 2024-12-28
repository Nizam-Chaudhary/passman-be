import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import passwordController from "../controllers/password";
import {
    addPasswordSchema,
    getPasswordResponseSchema,
    getPasswordsResponseSchema,
    importPasswordsSchema,
    updatePasswordSchema,
} from "../schemas/password";
import {
    errorSchema,
    idParamsSchema,
    responseSchema,
} from "../utils/basicSchema";

export default async (fastify: FastifyInstance) => {
    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "POST",
        url: "/",
        schema: {
            tags: ["Password"],
            summary: "Add a new password",
            description: "add password",
            security: [{ cookieAuth: [] }],
            body: addPasswordSchema,
            response: {
                200: responseSchema,
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
            security: [{ cookieAuth: [] }],
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
            security: [{ cookieAuth: [] }],
            params: idParamsSchema,
            response: {
                200: getPasswordResponseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: passwordController.getPassword,
    });

    fastify.withTypeProvider<ZodTypeProvider>().route({
        method: "PATCH",
        url: "/:id",
        schema: {
            tags: ["Password"],
            summary: "Update password by ID",
            description: "update password",
            security: [{ cookieAuth: [] }],
            params: idParamsSchema,
            body: updatePasswordSchema,
            response: {
                200: responseSchema,
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
            security: [{ cookieAuth: [] }],
            params: idParamsSchema,
            response: {
                200: responseSchema,
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
            security: [{ cookieAuth: [] }],
            body: importPasswordsSchema,
            response: {
                200: responseSchema,
                "4xx": errorSchema,
                "5xx": errorSchema,
            },
        },
        preHandler: [fastify.authenticate],
        handler: passwordController.importPasswords,
    });
};
