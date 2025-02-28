import env from "./env";

// const lokiTransport = {
//   target: "pino-loki",
//   options: {
//     batching: true,
//     interval: 10,
//     host: env.LOKI_URL,
//     labels: { app: "passman" },
//   },
// };

const pinoLogger = {
  target: env.LOGGER_TARGET,
};

const loggerTargets = [pinoLogger];

// if (env.NODE_ENV === "production") {
//   loggerTargets.push(lokiTransport);
// }

const logger = {
  level: env.LOG_LEVEL,
  transport: {
    targets: loggerTargets,
  },
};
export default logger;
