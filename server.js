//BASE SETUP

//===============================================

//CALL THE PACKAGES

var express = require('express'); // call express
var app = express(); //define app using express
var bodyParser = require('body-parser'); //get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/our database
var jwt = require('jsonwebtoken');

var superSecret = 'ilovekuukuaewuradwoamissyou';

var port = process.env.PORT || 8080; // set the port for the app

//Connect to our database 
//(hosted)

//mongoose.connect('mongodb://node:noder@novus.modulusmongo.net')

//or 

//Connect to our database 
//(locally)

mongoose.connect('mongodb://locolhost:27017/myDatabase')

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

apiRouter.post('/authenticate', function(req, res) { 
 
 //find the user
 // select the username and password explicitly

 User.findOne({
 	username: req.body.username
 }).select('name username password')
 	 .exec(function(err, user) {

 	 	if (err) throw err;

 	 	// no user with that username was found
 	 	if (!user) {
 	 		res.json({
 	 			success: false,
 	 			message: 'Authentication failed. User not found.'
 	 		});
 	 	} else if (user) {
 	 		// check if password matches
 	 		var validPassword = user.comparePassword(req.body.password);
 	 		if (!validPassword) {
 	 			res.json({
 	 				success: false,
 	 				message: 'Authentication failed. Wrong password.'
 	 			});
 	 		} else {

 	 			//if user is found and password is right
 	 			//create a token
 	 			
 	 			var token = jwt.sign({
 	 				name: user.name,
 	 				username: user.username 
 	 			}, superSecret, {
 	 				expiresInMinutes: 1440 // expires in 24 hours
 	 				});

 	 			// return the information including token as JSON
 	 			res.json({
 	 				success: true,
 	 				message: 'Enjoy your token!',
 	 				token: token
 	 			});

 	 		}
 	 	}
 	 });
});


// route middleware to verify a token

	apiRouter.use(function(req, res, next) {
		//do logging
		console.log('Somebody just came to our api');

		//check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		//decode token
		if (token) {

			//verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err) {
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					//if everything is good, save to request for use in other routes
					req.decoded = decoded;
					next();
				}
			});
		} else {
			//if there is no token
			//return an HTTP response 403 (access forbidden) and an error message

				return res.status(403).send({
					success:false,
					message: 'No token provided.'

				});
		}
	});
	//
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
						success: false, message: 'A user with that\
						username already exists.'});
							else
									return res.send(err);
			}
										res.json({ message:'User created!' });
		});
	})
		//get all users
	.get(function(req, res) {
		user.find(function(err, users) {
			if (err)
				res.send(err);

					//return the users
					res.json(users);
		});
	});

//deleting a user
apiRouter.route('/users/:user_id')
 .get(function(req, res) {

 })
 .put(function(req, res) {

 })

 .delete(function(req, res) {
 		User.remove({
 			_id:
 			req.params.user_id
 				}, function(err, user) {
 			if(err) return 
 				res.send(err);
 			res.json({ message:
 				'Successfully deleted' });
 			});
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