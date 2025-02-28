import Fastify from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import env from "./lib/env";
import logger from "./lib/logger";
import otelSdk from "./lib/otel";
import plugins from "./plugins";
import routes from "./route";

otelSdk.start();

async function main() {
  const fastify = await Fastify({
    logger,
  });
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
    process.on(signal, async () => {
      await fastify.close();
      await otelSdk.shutdown();
      process.exit(0);
    });
  }
}
