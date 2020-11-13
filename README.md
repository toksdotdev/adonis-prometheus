# Adonis Prometheus 🧐

Provides a simple way to easily montior your AdonisJS application via [Prometheus](https://prometheus.io/).

This is simply a wrapper around the NodeJS [prom-client](https://github.com/siimon/prom-client) library, along with extra in-built metrics tailored for AdonisJS.

You can also build your custom metrics with this library just as you would have done with [prom-client](https://github.com/siimon/prom-client). Check out [building custom metrics](#Building-Custom-Metrics).

## Installation

### Step 1

Run this command to install:

```
adonis install adonis-prometheus
```

### Step 2

Register the Adonis Prometheus provider in your AdonisJS application's `start/app.js`:

```js
const providers = [
  // ...,
  "adonis-prometheus/providers/PrometheusProvider",
];
```

### Step 3 (Optional)

There currently exists in-built metrics such as:

- `HTTP Metric`: Total time each HTTP request takes.
- `Uptime Metric`: Uptime performance of the application.
- `Throughput metric`: No. of request handled.

To enable them, simply register the `PrometheusMiddleware` as the **first item** in the `start/kernel.js`:

```js
const globalMiddleware = [
  // Make it first in the list for reliable metric.
  "Adonis/Prometheus/Middlewares/CollectPerformanceMetric",
  "Adonis/Middleware/BodyParser",
];
```

## Configure In-Built Metrics

There are scenarios were you want to:

- Configure the in-built metrics (e.g. change prefix, etc)
- Disable one or all the metrics entirely (and build yours from scratch).

To simply do that, simply modify the available configuration in [config/prometheus.js](./config/prometheus.js).

## Building Custom Metrics

### Track total emails sent.

```js
/** @type {typeof import('prom-client')} */
const Prometheus = use("Prometheus");

// Step 1: Create the metrics counter.
const sentEmails = new Prometheus.Counter(
  Config.get("prometheus.throughputMetric")
);

const sendEmail = async () => {
  // Implement logic to send Email here.

  // Step 2: Increment counter.
  sendEmail.inc(1);
};

// Step 3: Send the Email
sendEmail().then((_) => console.log("Email Sent & Metric Captured"));
```

## Documentation

This libary is simply a wrapper over [prom-client](https://github.com/siimon/prom-client). Hence, you can do everything [prom-client](https://github.com/siimon/prom-client) does with this library.

## Contributing

If you find any issue, bug or missing feature, please kindly create an issue or submit a pull request.

## License

Adonis Prometheus is open-sourced software under MIT license.
