/* eslint-disable @typescript-eslint/no-require-imports */
import appPackage from "../../../package.json";
import env from "../config/env";

// Conditional exports for meter and instrumentation
export let meter: any = {
  createCounter: () => ({ add: () => {} }),
  createHistogram: () => ({ record: () => {} }),
  createUpDownCounter: () => ({ add: () => {} }),
  createObservableGauge: () => ({ observe: () => {} }),
};
export let fastifyOtelInstrumentation: any = {
  setMeterProvider: () => {},
};

export let sdk: any = {
  shutdown: () => Promise<void>,
};

// Only load OpenTelemetry in production
if (process.env.NODE_ENV === "production") {
  const {
    getNodeAutoInstrumentations,
  } = require("@opentelemetry/auto-instrumentations-node");
  const nodeAutoInstrumentations = getNodeAutoInstrumentations({});
  const FastifyOtelInstrumentation = require("@fastify/otel");
  const { credentials } = require("@grpc/grpc-js");
  const {
    diag,
    DiagConsoleLogger,
    DiagLogLevel,
  } = require("@opentelemetry/api");
  const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-grpc");
  const {
    OTLPMetricExporter,
  } = require("@opentelemetry/exporter-metrics-otlp-grpc");
  const {
    OTLPTraceExporter,
  } = require("@opentelemetry/exporter-trace-otlp-grpc");
  const { Resource } = require("@opentelemetry/resources");
  const { BatchLogRecordProcessor } = require("@opentelemetry/sdk-logs");
  const {
    MeterProvider,
    PeriodicExportingMetricReader,
  } = require("@opentelemetry/sdk-metrics");
  const { NodeSDK } = require("@opentelemetry/sdk-node");
  const {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
  } = require("@opentelemetry/semantic-conventions");

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO); //enable for logging otel network calls

  // OTLP Trace Exporter (for traces)
  const traceExporter = new OTLPTraceExporter({
    url: env.OTLP_COLLECTOR_URL, // OTLP gRPC endpoint
    credentials: credentials.createInsecure(),
  });

  const metricExporter = new OTLPMetricExporter({
    url: env.OTLP_COLLECTOR_URL, // OTLP gRPC endpoint
    credentials: credentials.createInsecure(),
  });

  // OTLP Metric Exporter (for metrics)
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 5000, // Export every 5 seconds
  });

  // OTLP Log exporter (for logs)
  const logExporter = new OTLPLogExporter({
    url: env.OTLP_COLLECTOR_URL,
    credentials: credentials.createInsecure(),
  });

  const logProcessor = new BatchLogRecordProcessor(logExporter);

  const meterProvider = new MeterProvider({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: appPackage.name,
      [ATTR_SERVICE_VERSION]: appPackage.version,
    }),
    readers: [
      new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 5000,
      }),
    ],
  });

  meter = meterProvider.getMeter("fastify-metrics");

  fastifyOtelInstrumentation = new FastifyOtelInstrumentation({
    registerOnInitialization: true,
  });

  fastifyOtelInstrumentation.setMeterProvider(meterProvider);

  // OpenTelemetry SDK setup
  sdk = new NodeSDK({
    instrumentations: [nodeAutoInstrumentations, fastifyOtelInstrumentation],
    resource: new Resource({
      [ATTR_SERVICE_NAME]: appPackage.name,
      [ATTR_SERVICE_VERSION]: appPackage.version,
    }),
    traceExporter: traceExporter,
    metricReader: metricReader,
    logRecordProcessors: [logProcessor],
  });

  sdk.start();
}
