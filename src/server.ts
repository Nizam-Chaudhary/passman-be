import cors from "@fastify/cors";
import fJwt from "@fastify/jwt";
import secureSession from "@fastify/secure-session";
import fastifySwagger from "@fastify/swagger";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import routes from "./api/routes/routes";
import AppError from "./lib/appError";
import env from "./lib/env";
import { globalErrorHandler } from "./lib/errorHandler";
import { swaggerOptions } from "./utils/swagger";

const fastify = Fastify({
  logger: {
    transport: {
      targets: [
        { target: env.LOGGER_TARGET },
        {
          target: "pino/file",
          options: { destination: `${__dirname}/../app.log` },
        },
      ],
    },
    level: env.PINO_LOG_LEVEL,
  },
});

fastify.register(cors, {
  origin: true,
  credentials: true,
});

// @ts-ignore
fastify.register(secureSession, {
  secret: Buffer.from(env.SESSION_SECRET),
  cookie: {
    path: "/api",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
});

fastify.register(fJwt, { secret: env.JWT_SECRET });

fastify.addHook("preHandler", (req, _res, done) => {
  req.jwt = fastify.jwt;
  done();
});

fastify.register(
  fp(async (fastify) => {
    fastify.register(fastifySwagger, swaggerOptions);
  })
);
// fastify.register(swaggerUi, swaggerUiOptions);
fastify.register(routes);

// set global error handler
fastify.setErrorHandler(
  (error: AppError, request: FastifyRequest, reply: FastifyReply) => {
    globalErrorHandler(fastify, error, request, reply);
  }
);

async function main() {
  await fastify.listen({
    port: env.PORT,
    host: env.HOST,
  });
}

main();

// graceful shutdown
const listeners = ["SIGINT", "SIGTERM"];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    process.exit(0);
  });
});
