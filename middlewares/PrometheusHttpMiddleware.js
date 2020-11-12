"use strict";

// /** @type {typeof import('prom-client')} */
const metrics = require("../metrics");
const Config = use("Config");

class PrometheusHttpMiddlware {
  async handle({ request, response }, next) {
    const includeParams = JSON.parse(
      Config.get("prometheus.httpMetric.includeQueryParams")
    );

    const requestTimer = metrics.httpMetric.startTimer({
      method: request.method(),
      url: includeParams ? request.originalUrl() : url(),
    });

    await next();

    metrics.throughputMetric.inc();
    requestTimer({
      status_code: (response.res && req.res.statusCode) || res.statusCode || 0,
    });
  }
}

module.exports = PrometheusHttpMiddlware;
