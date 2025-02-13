import env from "./env";

const lokiTransport = {
  target: "pino-loki",
  options: {
    host: env.LOKI_URL,
    labels: { app: "passman" },
  },
};

const pinoPrettyLogger = {
  target: "pino-pretty",
};

const logger = {
  level: env.PINO_LOG_LEVEL,
  transport: {
    targets: [env.NODE_ENV === "production" ? lokiTransport : pinoPrettyLogger],
  },
};
export default logger;
