"use strict";

const Env = use("Env");

module.exports = {
  /*
   |--------------------------------------------------------------------------
   | Twilio SID
   |--------------------------------------------------------------------------
   */
  defaultMetrics: {
    enabled: false,
    prefix: null,
  },

  httpMetric: {
    enabled: true,
    name: "adonis-http-metrics",
    path: "/metrics",
    includeQueryParams: false,
    help: "",
    prefix: "",
    labelNames: [],
    buckets: [],
  },

  uptimeMetric: {
    enabled: false,
    prefix: null,
    name: "adonis-uptime-metrics",
    help: "",
  },

  throughputMetric: {
    enabled: false,
    prefix: null,
    name: "adonis-throughput-metrics",
  },
};
