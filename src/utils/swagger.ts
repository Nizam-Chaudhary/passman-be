import type { SwaggerOptions } from "@fastify/swagger";
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
        jwtAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    servers: [
      {
        url: "https://api.passman.live",
      },
      {
        url: "http://localhost:3000",
      },
    ],
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
      {
        name: "Vaults",
        tags: ["Vaults"],
      },
      {
        name: "Files",
        tags: ["Files"],
      },
    ],
  },
  transform: jsonSchemaTransform,
};
