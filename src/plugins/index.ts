import fastifyPlugin from "fastify-plugin";

import auth from "@/plugins/auth.js";
import cors from "@/plugins/cors.js";
import errorHandler from "@/plugins/error.handler.js";
import fastifyTypeProviderZod from "@/plugins/fastify.type.provider.zod.js";
import jwt from "@/plugins/jwt.js";
import multipart from "@/plugins/multipart.js";
import rateLimit from "@/plugins/rate.limit.js";
import recordFastifyMetrics from "@/plugins/record.fastify.metrics.js";
import swaggerDocs from "@/plugins/swagger.docs.js";

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
