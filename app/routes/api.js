var User       = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
   
// super secret for creating tokens
var superSecret = config.secret;
   
module.exports = function(app, express) {

//get an instance of the express router
var apiRouter = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
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
 return apiRouter;

};   