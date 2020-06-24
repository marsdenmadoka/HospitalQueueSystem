var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
var bodyParser=require("body-parser"); 
const { check, validationResult} = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');//hashing our password

var app=express()   
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 



app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));



/*Initialize Passport (authetification) to keep persisten login data (i.e in cookies)*/
app.use(passport.initialize());
app.use(passport.session());





/*
    Flash to pop-up mesages in the browser
*/
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


/*
    Ensure authetification
*/
// app.use('/app', (req, res, next) => {
//   // check to be authentificated
//   if (req.isAuthenticated()) { // if yes, continue
//       return next();
//   } else {                     // if no, login
//       // req.flash('error_msg', 'You are not logged in');
//       res.redirect('/');
//   }
// });



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var useRouter=require('./models/User');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user',useRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(4000,function() {
  console.log('Server started at port 4000');
  });
module.exports = app;
