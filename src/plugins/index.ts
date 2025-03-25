import fastifyPlugin from "fastify-plugin";

import auth from "./auth.js";
import cors from "./cors.js";
import errorHandler from "./error.handler.js";
import fastifyTypeProviderZod from "./fastify.type.provider.zod.js";
import jwt from "./jwt.js";
import multipart from "./multipart.js";
import rateLimit from "./rate.limit.js";
import recordFastifyMetrics from "./record.fastify.metrics.js";
import swaggerDocs from "./swagger.docs.js";

export default fastifyPlugin((fastify, opts, done) => {
  fastify.register(cors, opts);
  fastify.register(jwt, opts);
  fastify.register(fastifyTypeProviderZod, opts);
  fastify.register(errorHandler, opts);
  fastify.register(multipart, opts);
  fastify.register(swaggerDocs, opts);
  fastify.register(auth, opts);
  fastify.register(rateLimit, opts);
  fastify.register(recordFastifyMetrics, opts);
  done();
});
