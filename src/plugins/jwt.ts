import { fastifyJwt } from "@fastify/jwt";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import env from "../lib/env";

export default fastifyPlugin((fastify, _opts, done) => {
  fastify.register(fastifyJwt, { secret: env.JWT_SECRET });

  fastify.addHook("preHandler", (req, _res, done) => {
    req.jwt = fastify.jwt;
    done();
  });

  done();
});
