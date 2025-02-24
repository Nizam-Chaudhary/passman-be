import Fastify from "fastify";

import env from "./lib/env";
import logger from "./lib/logger";
import otelSdk from "./lib/otel";
import plugins from "./plugins";
import routes from "./route";

const fastify = Fastify({
  logger,
});

async function main() {
  otelSdk.start();
  await fastify.register(plugins);
  await fastify.register(routes);
  await fastify.listen({
    port: env.PORT,
    host: env.HOST,
  });
}

main();

// graceful shutdown
const listeners = ["SIGINT", "SIGTERM"];
for (const signal of listeners) {
  process.on(signal, async () => {
    await fastify.close();
    await otelSdk.shutdown();
    process.exit(0);
  });
}
