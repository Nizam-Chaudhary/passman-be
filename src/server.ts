import Fastify from "fastify";
import env from "./lib/env";
import loggerOptions from "./lib/logger.options";
import plugins from "./plugins";
import routes from "./routes";

const fastify = Fastify({
  logger: loggerOptions,
});

fastify.register(plugins);
fastify.register(routes);

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
