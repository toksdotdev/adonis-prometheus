"use strict";

const { join } = require("path");

module.exports = async cli => {
  await cli.makeConfig("twilio.js", join(__dirname, "./config/twilio.js"));
  cli.command.completed("create", "config/twilio.js");
};