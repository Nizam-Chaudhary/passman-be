import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import authenticate from "./authenticate";
import cors from "./cors";
import jwt from "./jwt";
import schemas from "./schemas";
import secureSession from "./secure.session";
import swaggerDocs from "./swagger.docs";

export default fastifyPlugin(
  (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {
    fastify.register(cors, opts);
    fastify.register(jwt, opts);
    fastify.register(secureSession, opts);
    fastify.register(swaggerDocs, opts);
    fastify.register(authenticate, opts);
    fastify.register(schemas, opts);

    done();
  }
);
