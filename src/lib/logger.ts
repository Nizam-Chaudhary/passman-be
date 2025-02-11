import env from "./env";

const logger = {
  level: env.PINO_LOG_LEVEL,
  transport: {
    targets: [
      {
        target: "pino-loki",
        options: {
          host: env.LOKI_URL,
          labels: { app: "passman" },
        },
      },
      {
        target: "pino-pretty",
        options: { colorize: true },
      },
    ],
  },
};
export default logger;
