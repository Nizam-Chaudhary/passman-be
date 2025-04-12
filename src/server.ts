import Fastify, { FastifyInstance } from "fastify";
import env from "./lib/env.js";
import logger from "./lib/logger.js";
import otelSdk from "./lib/otel.js";
import plugins from "./plugins/index.js";
import routes from "./route.js";

if (env.TELEMETRY_ENABLED === "true") {
  otelSdk.start();
}

const fastify = Fastify({
  logger,
});

async function main() {
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
