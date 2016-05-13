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
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);
var port = process.env.PORT || 8080, // set the port for the app

//Connect to our database 
//(hosted)

//mongoose.connect('mongodb://node:noder@novus.modulusmongo.net')

//or 

//Connect to our database 
//(locally)

//mongoose.connect('mongodb://locolhost:27017/myDatabase')

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

// ROUTES FOR THE API
//====================================

//basic route for the home page

app.get('/', function(req, res) {
	res.send('Welcome to the home page!');
});



 // api endpoint to get user information

 apiRouter.get('/me', function(req, res) {
 	res.send(req.decoded);
 });


//REGISTER ROUTES=====================

// all routes will be prefixed with /api

app.use('/api' , apiRouter);

//START THE SERVER
//======================

app.listen(port);
console.log('Magic happens on port ' + port);