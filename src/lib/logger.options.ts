import env from "./env";

export default {
  transport: {
    targets: [
      { target: env.LOGGER_TARGET },
      {
        target: "pino/file",
        options: { destination: `app.log` },
      },
    ],
  },
  level: env.PINO_LOG_LEVEL,
};
