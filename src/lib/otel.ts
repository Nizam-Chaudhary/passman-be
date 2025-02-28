import FastifyOtelInstrumentation from "@fastify/otel";
// import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { GrpcInstrumentation } from "@opentelemetry/instrumentation-grpc";
import { Resource } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import appPackage from "../../package.json";
import env from "./env";

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO); //enable for logging otel network calls

const grpcInstrumentation = new GrpcInstrumentation();

// OTLP Trace Exporter (for traces)
const traceExporter = new OTLPTraceExporter({
  url: env.OTLP_COLLECTOR_URL, // OTLP gRPC endpoint
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  credentials: require("@grpc/grpc-js").credentials.createInsecure(),
});

const metricExporter = new OTLPMetricExporter({
  url: env.OTLP_COLLECTOR_URL, // OTLP gRPC endpoint
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  credentials: require("@grpc/grpc-js").credentials.createInsecure(),
});

// OTLP Metric Exporter (for metrics)
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 5000, // Export every 5 seconds
});

// OTLP Log exporter (for logs)
const logExporter = new OTLPLogExporter({
  url: env.OTLP_COLLECTOR_URL,
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  credentials: require("@grpc/grpc-js").credentials.createInsecure(),
});

const logProcessor = new BatchLogRecordProcessor(logExporter);
export const fastifyOtelInstrumentation = new FastifyOtelInstrumentation({
  registerOnInitialization: true,
});

// OpenTelemetry SDK setup
const sdk = new NodeSDK({
  instrumentations: [
    getNodeAutoInstrumentations(),
    fastifyOtelInstrumentation,
    grpcInstrumentation,
  ],
  resource: new Resource({
    [ATTR_SERVICE_NAME]: appPackage.name,
    [ATTR_SERVICE_VERSION]: appPackage.version,
  }),
  traceExporter: traceExporter,
  metricReader: metricReader,
  logRecordProcessors: [logProcessor],
});

export default sdk;
