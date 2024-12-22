import { buildJsonSchemas } from "fastify-zod";
import {
    addPasswordSchema,
    getPasswordResponseSchema,
    getPasswordsResponseSchema,
    importPasswordsSchema,
    updatePasswordSchema,
} from "../schemas/password";
import {
    getUserResponseSchema,
    signInUserSchema,
    signUpUserSchema,
    updateUserSchema,
} from "../schemas/user";
import { idParamsSchema, responseSchema } from "../utils/basicSchema";

export const errorSchema = {
    $id: "errorSchema",
    oneOf: [
        {
            type: "object",
            properties: {
                status: { type: "string", default: "error" },
                message: { type: "string", default: "something went wrong!" },
            },
        },
        {
            type: "object",
            properties: {
                status: { type: "string", default: "error" },
                message: { type: "string", default: "something went wrong!" },
                stack: { type: "string", default: "Error stack" },
            },
        },
    ],
};

export const { schemas: Schemas, $ref } = buildJsonSchemas({
    // common
    responseSchema,
    idParamsSchema,

    // user
    signUpUserSchema,
    signInUserSchema,
    updateUserSchema,
    getUserResponseSchema,

    // password
    addPasswordSchema,
    updatePasswordSchema,
    getPasswordsResponseSchema,
    getPasswordResponseSchema,
    importPasswordsSchema,
});
