// import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
// import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
// import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
// import { Resource } from "@opentelemetry/resources";
// import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
// import { NodeSDK } from "@opentelemetry/sdk-node";
// import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
// import env from "./env";

// const otelSDK = new NodeSDK({
//   resource: new Resource({
//     [ATTR_SERVICE_NAME]: "passman-be",
//   }),
//   instrumentations: [getNodeAutoInstrumentations()],
//   traceExporter: new OTLPTraceExporter({
//     url: env.TEMPO_URL, // Tempo endpoint
//   }),
//   metricReader: new PeriodicExportingMetricReader({
//     exporter: new OTLPMetricExporter({
//       url: env.PROMETHEUS_URL, // Prometheus endpoint
//     }),
//   }),
// });

// export default otelSDK;

// deps
// "@opentelemetry/auto-instrumentations-node": "^0.56.0",
// "@opentelemetry/exporter-metrics-otlp-grpc": "^0.57.2",
// "@opentelemetry/exporter-trace-otlp-grpc": "^0.57.2",
// "@opentelemetry/resources": "^1.30.1",
// "@opentelemetry/sdk-metrics": "^1.30.1",
// "@opentelemetry/sdk-node": "^0.57.2",
// "@opentelemetry/semantic-conventions": "^1.30.0",
