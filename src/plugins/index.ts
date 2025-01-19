import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import authenticate from "./authenticate";
import cors from "./cors";
import errorHandler from "./error.handler";
import fastifyTypeProviderZod from "./fastify.type.provider.zod";
import jwt from "./jwt";
import swaggerDocs from "./swagger.docs";

export default fastifyPlugin(
  (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
    fastify.register(cors, opts);
    fastify.register(jwt, opts);
    fastify.register(fastifyTypeProviderZod, opts);
    fastify.register(errorHandler, opts);
    fastify.register(swaggerDocs, opts);
    fastify.register(authenticate, opts);

    done();
  }
);
