var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

const morgan = require('./utils/morgan');
const resMsg = require('./utils/utils').resMsg;
const noSessionUrl = ['/admin/login', '/admin/register', '/getPublicKey'];

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
  secret: 'lolHQupaD7pzuuVunipqiK8gyQeZLg+ZAOvgA3jzNgpXPeGmWqhSHbFuiXn8OKqN9ldADkf+38KX9NJfqkG9JA==', //签名
  name: 'SESSION_ID',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000 * 300
  }
}))

app.use(function (req, res, next) {
  if (req.session.user && typeof req.session.user === 'string') {
    next();
  } else {
    let url = req.originalUrl;
    if (noSessionUrl.indexOf(url) !== -1) {
      next();
    } else {
      console.log(1);
      res.status(401).json(resMsg(401));
    }
  }
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;