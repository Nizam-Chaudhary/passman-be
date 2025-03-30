import "reflect-metadata";
import Fastify, { FastifyInstance } from "fastify";
import env from "./shared/config/env.js";
import logger from "./shared/config/logger.js";
import otelSdk, { fastifyOtelInstrumentation } from "./shared/lib/otel.js";
import plugins from "./plugins/index.js";
import routes from "./route.js";
import "./dIRegistry.js";
import { container } from "tsyringe";

otelSdk.start();

const fastify = Fastify({
  logger,
});

container.register("Logger", { useValue: fastify.log });

async function main() {
  await fastify.register(fastifyOtelInstrumentation.plugin());
  await fastify.register(plugins);
  await fastify.register(routes);
  await fastify.listen({
    port: env.PORT,
    host: env.HOST,
  });

  setupGracefulShutdown(fastify);
}

main();

function setupGracefulShutdown(fastify: FastifyInstance) {
  const listeners = ["SIGINT", "SIGTERM"];
  for (const signal of listeners) {
    process.once(signal, async () => {
      await fastify.close();
      await otelSdk.shutdown();
      process.exit(0);
    });
  }
}
