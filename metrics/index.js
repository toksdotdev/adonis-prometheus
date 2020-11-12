"use strict";

/** @type {typeof import('prom-client')} */
const prometheus = use("Adonis/Prometheus");
const Config = use("Adonis/Src/Config");

module.exports = {
  httpMetric: new prometheus.Histogram(Config.get("prometheus.httpMetric")),
  uptimeMetric: new prometheus.Gauge(Config.get("prometheus.uptimeMetric")),
  throughputMetric: new prometheus.Counter(
    Config.get("prometheus.throughputMetric")
  ),
};
