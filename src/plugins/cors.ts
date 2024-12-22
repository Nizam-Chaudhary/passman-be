import fastifyCors from "@fastify/cors";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(
  (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
    fastify.register(fastifyCors, {
      origin: true,
      credentials: true,
    });

    done();
  }
);
