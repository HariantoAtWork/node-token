var jwt         = require('jsonwebtoken'); // used to create, sign, and verify tokens

var Memory      = require('../../core/memory');

// globals
var APP_ROOT_PATH = Memory.get('APP_ROOT_PATH');
// declare 'log' function
eval("var log = " + require(APP_ROOT_PATH + '/log'));

var app_uuid    = require(APP_ROOT_PATH + '/app/core/uuid');
var User_credentials = require(APP_ROOT_PATH + '/app/models/user_credentials');

module.exports = {
	/**
	 * route_validateToken() Middleware route that validates token
	 */
	route_validateToken: function (req, res, next) {
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		log('Middleware - token: '+token);
		// decode token
		if (token) {

		    // verifies secret and checks exp
		    jwt.verify(token, app_uuid, function (err, decoded) {      
		    	if (err) {
		    		return res.json({ success: false, message: 'Failed to authenticate token.' });  

		    	} else {

			        // if everything is good, save to request for use in other routes
			        req.decoded = decoded;    
			        next();
			        log('route_validateToken | next()');
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
	},

	/**
	 * route_requireRole() - Middleware route that requires specific role before continuing
	 * @param  {string} role - 
	 */
	route_requireRole: function (role) {
		return function (req, res, next) {
			// get user uuid from request
			log('route_requireRole |', req.decoded);
			var user_uuid = req.decoded.sub;
			log('route_requireRole |', user_uuid);
			User_credentials()
				.done(
					// on succes
					function (credentials){
						found_credential = credentials.findOne({ 'uuid': user_uuid });
						log('route_requireRole |\n', found_credential);

						if (found_credential && found_credential.roles.indexOf(role) > -1) {
							next();
						} else {
							res.status(403).json({ 
								success: false, 
								message: 'Roles denied' 
							});
						}
						


					}, 
					// on error
					function (error) {
						res.status(403).json({
							success: false,
							message: error
						})
					})
			// if(req.session.user && req.session.user.role === role)
			// 	next();
			// else
			// 	res.send(403);
		}
	},

	/**
	 * onError() - route respond
	 * 
	 * @param  {any} error - Promise.reject
	 */
	onError: function (error) {
		this.json({
			success: false,
			message: error
		})
	}
}