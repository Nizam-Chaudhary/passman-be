import fJwt from '@fastify/jwt';
import secureSession from '@fastify/secure-session';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import routes from './api/routes/routes';
import AppError from './lib/appError';
import env from './lib/env';
import { globalErrorHandler } from './lib/errorHandler';

const logger =
  env.NODE_ENV === 'production'
    ? {
        level: env.PINO_LOG_LEVEL,
        formatters: {
          level: (label: string) => {
            return { severity: label.toUpperCase() };
          },
        },
        timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
      }
    : {
        transport: {
          target: 'pino-pretty',
        },
        level: env.PINO_LOG_LEVEL,
      };
const fastify = Fastify({
  logger: logger,
});

// @ts-ignore
fastify.register(secureSession, {
  secret: Buffer.from(env.SESSION_SECRET),
  cookie: {
    path: '/api',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
});

fastify.register(fJwt, { secret: env.JWT_SECRET });

fastify.addHook('preHandler', (req, _res, done) => {
  req.jwt = fastify.jwt;
  done();
});

// Register all routes
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
const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    process.exit(0);
  });
});
