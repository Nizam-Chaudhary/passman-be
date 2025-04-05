import "@abraham/reflection";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sdk: otelSdk } = require("./shared/lib/otel");
import Fastify, { FastifyInstance } from "fastify";
import env from "./shared/config/env";
import logger from "./shared/config/logger";
import plugins from "./plugins/index";
import routes from "./route";
import "./dIRegistry";
import { container } from "tsyringe";

const fastify = Fastify({
  logger,
});

container.register("Logger", { useValue: fastify.log });

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
