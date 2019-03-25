const path = require("path");
const log4js = require("log4js");
let fileName = "log";

log4js.configure({
  appenders: {
    console: {
      type: "console",
    },
    data_file: {
      type: "dateFile",
      filename: path.join(__dirname, `/../logs/${fileName}`),
      alwaysIncludePattern: true,
      daysToKeep: 10,
      pattern: "_yyyy-MM-dd-hh.log",
      encoding: "utf-8",
    },
  },
  categories: {
    default: {
      appenders: ["console"],
      level: "info"
    },
    production: {
      appenders: ["data_file"],
      level: "warn"
    },
    console: {
      appenders: ["console"],
      level: "all"
    }
  },
});

let logger;
if (process.env.NODE_ENV == "development") {
  logger = log4js.getLogger("console");
} else {
  logger = log4js.getLogger("production");
}
module.exports = logger;