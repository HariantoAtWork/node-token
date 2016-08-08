var express     = require('express'),
	router      = express.Router();

var jwt         = require('jsonwebtoken'), // used to create, sign, and verify tokens
	_uuid       = require('node-uuid');

var middlewares         = require('./v1/middlewares'); // collection of middlewares

var Users               = require('../models/users'), // get our lokijs model
	User_credentials    = require('../models/user_credentials'), // get our lokijs model
	db                  = require('../core/database'),
	app_uuid            = require('../core/uuid');

// declare 'log' function
eval("var log = " + require('../../log'));

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res) {


	User_credentials()
		.done(function(credentials) {
			var found_credential = credentials.findOne({ 'username': req.body.username});

			log(found_credential);
			log(req.body);

			if (found_credential) {
				// check password
				if (found_credential.password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });

				} else {
					var claims = {
						jti:  _uuid.v1(), // timed uuid
						sub:  found_credential.uuid,
						iss:  'https://sylo.space'
					}
					// if user is found and password is right
					// create a token
					var token = jwt.sign(claims, app_uuid, {
						expiresIn: 60*60*24 // expires in 24 hours
					});

					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});

					// ----------
					    // verifies secret and checks exp
					    jwt.verify(token, app_uuid, function(err, decoded) {      
					    	if (err) {
					    		
					    	} else {
						        // if everything is good, save to request for use in other routes
						       log('\n',decoded)

						    }

					    });
					// ----------
				}
			} else {
				// bad authentication
				res.json({ success: false, message: 'Authentication failed. User not found.' });

			}


		}, middlewares.onError.bind(res));
});

router.use('/v1', require('./v1/index'));
// This order is important!
// This goes after '/authenticate'
// route middleware to verify a token
router.use(middlewares.route_validateToken);

// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function(req, res) {
  res.json({ 
  	success: true,
  	data: 'Welcome to the coolest API on earth!' });
});


router.get('/users', function(req, res) {
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



module.exports = router;