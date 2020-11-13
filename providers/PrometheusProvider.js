"use strict";

const prometheus = require("prom-client");
const { ServiceProvider } = use("@adonisjs/fold");

class PrometheusProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    /**
     * Configure Prometheus.
     */
    this.app.singleton("Adonis/Prometheus", () => {
      const Config = this.app.use("Adonis/Src/Config");

      /**
       * Configure system metircs collection.
       */
      const systemMetrics = Config.get("prometheus.systemMetrics");
      if (systemMetrics.enabled) {
        const { enabled, ...params } = systemMetrics;
        prometheus.collectDefaultMetrics(params);
      }
      return prometheus;
    });

    /**
     * Setup middlewares.
     */
    this.app.bind(
      "Adonis/Prometheus/Middlewares/CollectPerformanceMetric",
      () => {
        const CollectPerformanceMetric = require("../src/Middlewares/CollectPerformanceMetric");
        return new CollectPerformanceMetric();
      }
    );
  }

  /**
   * On boot add commands with ace.
   *
   * @return {void}
   */
  boot() {
    const customMetrics = require("../src/Metrics");
    const Config = this.app.use("Adonis/Src/Config");

    /**
     * Register alias.
     */
    this.app.alias("Adonis/Prometheus", "Prometheus");

    /**
     * Expose metrics via API endpoint.
     */
    if (Config.get("prometheus.exposeHttpEndpoint")) {
      this._exposeMetricViaApi(Config.get("prometheus.endpoint", "/metrics"));
    }

    /**
     * Setup uptime metrics.
     */
    const enableUptimeMetric = Config.get("prometheus.uptimeMetric.enabled");
    if (enableUptimeMetric) {
      customMetrics.uptimeMetric.inc(1);
    }
  }

  /**
   * Expose metrics via API endpoint.
   */
  _exposeMetricViaApi(urlPath) {
    const router = this.app.use("Route");

    /**
     * Create route.
     */
    router.get(urlPath, ({ response }) =>
      response
        .header("Content-type", prometheus.register.contentType)
        .ok(prometheus.register.metrics())
    );
  }
}

module.exports = PrometheusProvider;
