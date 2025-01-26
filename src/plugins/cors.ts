import fastifyCors from "@fastify/cors";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import env from "../lib/env";

export default fastifyPlugin(
  (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
    fastify.register(fastifyCors, {
      origin: env.FE_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    done();
  }
);
