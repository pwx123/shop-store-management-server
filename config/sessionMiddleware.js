var session = require("express-session");
var redis = require("./redisConnect").reids;
var redisStore = require("connect-redis")(session);

module.exports = session({
  store: new redisStore({
    client: redis,
    prefix: ""
  }),
  secret: "lolHQupaD7pzuuVunipqiK8gyQeZLg+ZAOvgA3jzNgpXPeGmWqhSHbFuiXn8OKqN9ldADkf+38KX9NJfqkG9JA", //签名
  name: "SESSION_ID",
  resave: true, // 重新写入redis
  rolling: true, // 重新计算时间
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1小时过期
  }
});