const path = require('path');
const log4js = require('log4js');
let fileName = "log";

log4js.configure({
  appenders: {
    console: {
      type: 'console',
    },
    log_file: {
      type: 'file',
      filename: path.join(__dirname, `/../logs/${fileName}.log`),
      maxLogSize: 20971520,
      backups: 3,
      encoding: 'utf-8',
    },
    data_file: {
      type: "dateFile",
      filename: path.join(__dirname, `/../logs/${fileName}.log`),
      alwaysIncludePattern: true,
      daysToKeep: 10,
      pattern: "_yyyy-MM-dd-hh.log",
      encoding: 'utf-8',
    },
    error_file: {
      type: "dateFile",
      filename: path.join(__dirname, `/../logs/${fileName}_error.log`),
      alwaysIncludePattern: true,
      daysToKeep: 10,
      pattern: "_yyyy-MM-dd.log",
      encoding: 'utf-8',
      // compress: true,
    }
  },
  categories: {
    default: {
      appenders: ['data_file', 'console', 'log_file'],
      level: 'info'
    },
    production: {
      appenders: ['data_file'],
      level: 'warn'
    },
    console: {
      appenders: ['console'],
      level: 'all'
    },
    debug: {
      appenders: ['console', 'log_file'],
      level: 'debug'
    },
    error_log: {
      appenders: ['error_file'],
      level: 'error'
    }
  },
});

module.exports = log4js.getLogger('console');