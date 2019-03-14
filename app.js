var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var redis = require('./config/redisConnect').reids;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bookRouter = require('./routes/book');
var adminRouter = require('./routes/admin');
var shopRouter = require('./routes/shop');

const morgan = require('./config/morgan');
const resMsg = require('./utils/utils').resMsg;
const noSessionUrl = ['/admin/login', '/admin/register', '/getPublicKey', '/getUserList'];

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(morgan('live-api'));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store: new redisStore({
    client: redis,
    prefix: 'se'
  }),
  secret: 'lolHQupaD7pzuuVunipqiK8gyQeZLg+ZAOvgA3jzNgpXPeGmWqhSHbFuiXn8OKqN9ldADkf+38KX9NJfqkG9JA', //签名
  name: 'SESSION_ID',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}))

app.use(function (req, res, next) {
  if (req.session.loginUser && typeof req.session.loginUser === 'string') {
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
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/book', bookRouter);
app.use('/admin', adminRouter);
app.use('/shop', shopRouter);

//404 handler
app.use(function (req, res, next) {
  res.status(404).json(resMsg(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(resMsg());
});

module.exports = app;