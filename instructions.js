"use strict";

const { join } = require("path");

module.exports = async (cli) => {
  await cli.makeConfig("prometheus.js", join(__dirname, "./config/prometheus.js"));
  cli.command.completed("create", "config/prometheus.js");
};
