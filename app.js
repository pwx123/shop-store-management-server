var createError = require("http-errors");
var express = require("express");
var path = require("path");

var sessionMiddleware = require("./config/sessionMiddleware");
const morgan = require("./config/morgan");
const resMsg = require("./utils/utils").resMsg;
const logger = require("./config/log4j");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");
var bookRouter = require("./routes/book");
var adminRouter = require("./routes/admin");
var shopRouter = require("./routes/shop");
var orderRouter = require("./routes/order");
var apiRouter = require("./routes/api");

const noSessionUrl = ["/admin/login", "/admin/register", "/getPublicKey", "/getUserList", "/api/getOrder", "/api/orderNotify"];

var app = express();

var io = require("socket.io").listen(app.listen(3000));
io.sockets.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
io.sockets.use(function (socket, next) {
  if (socket.request.session.loginUser && typeof socket.request.session.loginUser === "string") {
    next();
  } else {
    socket.emit("err", resMsg(401));
    socket.disconnect(true);
  }
});
io.sockets.on("connection", (socket) => {
  console.log("\x1B[32m new socket.io connection successfully\x1B[0m");
});
app.io = io;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(morgan("live-api"));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleware);

app.use(function (req, res, next) {
  if (req.session.loginUser && typeof req.session.loginUser === "string") {
    next();
  } else {
    let url = req.originalUrl;
    if (noSessionUrl.indexOf(url) !== -1) {
      next();
    } else {
      res.status(401).json(resMsg(401));
    }
  }
});
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/book", bookRouter);
app.use("/admin", adminRouter);
app.use("/shop", shopRouter);
app.use("/order", orderRouter);
app.use("/api", apiRouter);

//404 handler
app.use(function (req, res, next) {
  res.status(404).json(resMsg(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json(resMsg());
});

module.exports = app;
