import { FastifyJWT } from "@fastify/jwt";
import { FastifyInstance, FastifyRequest } from "fastify";
import { JsonSchema } from "fastify-zod";
import { FastifyReply } from "fastify/types/reply";
import { errorSchema, Schemas } from "../../lib/apiSchema";
import AppError from "../../lib/appError";
import docsRoute from "./docs.route";
import passwordRoute from "./password.route";
import userRoute from "./user.route";

export default async (fastify: FastifyInstance) => {
  fastify.get(
    "/health-check",
    {
      schema: {
        description: "Check server health",
        summary: "Server health",
        tags: ["Default"],
      },
    },
    (_req, reply: FastifyReply) => {
      reply.code(200).send({
        status: "success",
        message: "Working fine",
      });
    }
  );

  fastify.decorate(
    "authenticate",
    async (req: FastifyRequest, _reply: FastifyReply) => {
      const token = req.session.get("access_token");

      if (!token) {
        throw new AppError("UNAUTHORIZED", "please sign in first", 401);
      }

      const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
      req.user = decoded;
    }
  );
  addSchema(fastify, Schemas);
  fastify.register(docsRoute);
  fastify.register(userRoute, { prefix: "/api/v1/users" });
  fastify.register(passwordRoute, { prefix: "/api/v1/passwords" });
};

const addSchema = (fastify: FastifyInstance, schemas: JsonSchema[]) => {
  fastify.addSchema(errorSchema);
  for (const schema of schemas) {
    fastify.addSchema(schema);
  }
};
