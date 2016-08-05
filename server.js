// =======================
// get the packages we need ============
// =======================
var express     = require('express'),
	bodyParser  = require('body-parser'),
	morgan      = require('morgan');

var Memory      = require('./app/core/memory');

var app         = express();
// var mongoose    = require('mongoose');
var path = require('path');
global.APP_ROOT_PATH = path.resolve(__dirname);


var config = require('./config'); // get our config file


    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens


// mongoose.connect(config.database); // connect to database
// app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// setup route
app.use('/', require('./app/routes/setup'));
// basic route
app.use('/', require('./app/routes/index'));
// api route
app.use('/api', require('./app/routes/api'));



// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);