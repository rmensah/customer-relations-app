//BASE SETUP

//===============================================

//CALL THE PACKAGES

var express = require('express'); // call express
var app = express(); //define app using express
var bodyParser = require('body-parser'); //get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/our database
var jwt = require('jsonwebtoken');
var config = require('./config');
var path = require('path');
var port = process.env.PORT || 8080, // set the port for the app



// APP CONFIGURATION ------------------
// Use body parser so we can grab information from post requests

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

//configure app to handle CORS requests

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin' , '*');

	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers' , 'X-Requested-With,content-type, \Authorization');
	next();

});

//log all requests to the console
app.use(morgan('dev'));


//Connect to our database (hosted)
//mongoose.connect('config.database');

//or 

//Connect to our database (locally)
//mongoose.connect('mongodb://locolhost:27017/myDatabase')

//set static files location
// used for requests that our frontend will make

app.use(express.static(__dirname + '/public'));

// ROUTES FOR THE API
//====================================


//API ROUTES ------------------

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);


// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES

//route for the home page
app.get('*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/app/views/index.html'));

});



 // api endpoint to get user information

 apiRouter.get('/me', function(req, res) {
 	res.send(req.decoded);
 });

app.use('/api' , apiRouter);

//START THE SERVER
//======================

app.listen(config.port);
console.log('Magic happens on port ' + config.port);