import { fastifyJwt } from "@fastify/jwt";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import env from "../lib/env";

export default fastifyPlugin(
  (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
    fastify.register(fastifyJwt, { secret: env.JWT_SECRET });

    fastify.addHook("preHandler", (req, _res, done) => {
      req.jwt = fastify.jwt;
      done();
    });

    done();
  }
);
