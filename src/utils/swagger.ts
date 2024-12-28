import { SwaggerOptions } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerOptions: SwaggerOptions = {
    openapi: {
        openapi: "3.0.3",
        info: {
            title: `Passman API's`,
            description: `Passman Backend API's`,
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    name: "session",
                    in: "cookie",
                },
            },
        },
        // Use `x-tagGroups` to group tags under a parent
        // @ts-ignore
        "x-tagGroups": [
            {
                name: "Health",
                tags: ["Health"],
            },
            {
                name: "Users",
                tags: ["User", "Auth"],
            },
            {
                name: "Passwords",
                tags: ["Password"],
            },
        ],
    },
    transform: jsonSchemaTransform,
};
