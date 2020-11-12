"use strict";

const prometheus = require("prom-client");
const { ServiceProvider } = require("@adonisjs/fold");

class PrometheusProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton("Adonis/Prometheus", () => {
      /**
       * Configure default metircs collection.
       */
      const defaultMetricsEnabled = Config.get(
        "prometheus.defaultMetrics.enabled"
      );
      if (defaultMetricsEnabled) this._setupDefaultMetrics();

      return prometheus;
    });
  }

  /**
   * On boot add commands with ace.
   *
   * @return {void}
   */
  boot() {
    const config = this.app.use("Adonis/Src/Config");

    /**
     * Configure HTTP metrics.
     */
    const enableHttpMetric = JSON.parse(
      config.get("prometheus.httpMetric.enabled", true)
    );
    if (enableHttpMetric) this._setupHttpMetric();

    /**
     * Configure throughput metric.
     */
    const enableThroughtputMetric = JSON.parse(
      config.get("prometheus.throughtputMetric.enabled", false)
    );
    if (enableThroughtputMetric) this._s();

    /**
     * Configure uptime metrics.
     */
    const enableUptimeMetric = JSON.parse(
      config.get("prometheus.uptimeMetric.enabled", false)
    );
    if (enableUptimeMetric) this._setupHttpMetric();

    this.app.alias("Adonis/Prometheus", "Prometheus");
  }

  /**
   * Configure default metrics.
   */
  _setupDefaultMetrics() {
    const { enabled, ...params } = Config.get("prometheus.defaultMetrics");
    prometheus.collectDefaultMetrics(params);
  }

  /**
   * Configure HTTP metrics.
   */
  _setupHttpMetric() {
    const router = this.app.use("Route");
    const metricsPath = Config.get("prometheus.httpMetric.path", "/metrics");

    /**
     * Register the router.
     */
    router.get(metricsPath, ({ response }) =>
      response
        .header("Content-type", prometheus.register.contentType)
        .ok(prometheus.register.metrics())
    );
  }
}

module.exports = PrometheusProvider;
