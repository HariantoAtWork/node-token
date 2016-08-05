var express     = require('express'),
	jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens

var routes      = express.Router();

var Users       = require('../models/users'),
	uuid        = require('../config/uuid');


// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token



var onError = function(error) {
	this.json({
		success: false,
		message: error
	})
}

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
routes.post('/authenticate', function(req, res) {

	Users()
		.done(function(users) {
			var user = users.findOne({ 'name': req.body.name});

			if (user) {
				// check password
				if (user.password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });

				} else {
					var claims = {
						sub:  user.uuid,
						iss:  'https://sylo.space'
					}
					// if user is found and password is right
					// create a token
					var token = jwt.sign(claims, uuid, {
						expiresIn: 60*60*24 // expires in 24 hours
					});

					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}
			} else {
				// bad authentication
				res.json({ success: false, message: 'Authentication failed. User not found.' });

			}


		}, onError.bind(res));
});


// route middleware to verify a token
routes.use(function(req, res, next) {


	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	console.log('Middleware - token: '+token);
	// decode token
	if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, uuid, function(err, decoded) {      
	    	if (err) {
	    		return res.json({ success: false, message: 'Failed to authenticate token.' });  

	    	} else {
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded;    
		        next();

		    }

	    });

	} else {
		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
	}

});

// route to show a random message (GET http://localhost:8080/api/)
routes.get('/', function(req, res) {
  res.json({ 
  	success: true,
  	data: 'Welcome to the coolest API on earth!' });
});


routes.get('/users', function(req, res) {
	Users()
		.done(
			function(users){
				var output = { 
					success: true,
					data: users.data 
				};
				res.json(output);
			}, onError.bind(res));
});



module.exports = routes;