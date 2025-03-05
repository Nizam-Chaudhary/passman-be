import Fastify from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import env from "./lib/env";
import logger from "./lib/logger";
import otelSdk, { fastifyOtelInstrumentation } from "./lib/otel";
import plugins from "./plugins";
import routes from "./route";

otelSdk.start();

const fastify = Fastify({
  logger,
});

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
