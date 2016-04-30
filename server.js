//BASE SETUP

//===============================================

//CALL THE PACKAGES

var express = require('express'); // call express
var app = express(); //define app using express
var bodyParser = require('body-parser'); //get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/our database

var port = process.env.PORT || 8080; // set the port for the app


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

//get an instance of the express router

var apiRouter = express.Router();

//test route to make sure everything is working
//accessed at GET http://locolhost:8080/api

apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! Welcome to our api!' });
});

//more routes for the API will go here


// on routes that end in /users”

apiRouter.route('/users')
	.post(function(req , res) {

		var user = new User();
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		user.save(function(err) {
			if (err) {
				if(err.code == 11000)
					return res.json({
						success: false, message: 'A user with that\username already exists.'});
							else
									return res.send(err);
			}
										res.json({ message:'User created!' });
		});
	})




//REGISTER ROUTES=====================

// all routes will be prefixed with /api

app.use('/api' , apiRouter);

//START THE SERVER
//======================

app.listen(port);
console.log('Magic happens on port ' + port);