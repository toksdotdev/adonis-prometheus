"use strict";

const metrics = require("../metrics");
const Config = use("Config");

class CollectPerformanceMetric {
  async handle({ request, response }, next) {
    let stopHttpRequestTimer;

    /**
     * Extract config.
     */
    const { enabled: enableHttpMetric, includeQueryParams } = Config.get(
      "prometheus.httpMetric.enabled"
    );

    const enableThroughputMetric = Config.get(
      "prometheus.throughtputMetric.enabled"
    );

    /**
     * Start HTTP request timer.
     */
    if (enableHttpMetric) {
      stopHttpRequestTimer = metrics.httpMetric.startTimer({
        method: request.method(),
        url: includeQueryParams ? request.originalUrl() : url(),
      });
    }

    /**
     * Continue execution.
     */
    await next();

    /**
     * Track request throughput..
     */
    if (enableThroughputMetric) metrics.throughputMetric.inc();

    /**
     * End HTTP request timer.
     */
    if (enableHttpMetric) {
      stopHttpRequestTimer({
        statusCode: response.response.statusCode,
      });
    }
  }
}

module.exports = CollectPerformanceMetric;
