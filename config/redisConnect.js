var ioRedis = require("ioredis");
var logger = require("./log4j");
var redis = new ioRedis();
redis.connect(function () {
  console.log("\x1B[32m redis connection successfully\x1B[0m");
});
redis.on("error", function (error) {
  logger.error(error);
});
exports.redis = redis;