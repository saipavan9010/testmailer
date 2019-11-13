var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const cron = require("node-cron");

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var jwt = require('jsonwebtoken');
var cors = require('cors')
var app = express();
app.use(fileUpload());
app.disable('etag');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))



app.set('secretKey', 'testinnode'); //jwt secret token

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
  
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user',validateUser,usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Successfully connected to the database");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

function validateUser(req, res, next) {
  //  console.log(req.headers['authorization']);
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  //console.log(token);
  if (token.startsWith('Bearer ')) {
    //console.log("pavan");
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  
  if (token) {
    //console.log(token);
     jwt.verify(token, req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.status(422).json({message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });


  }else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
 
}







// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
