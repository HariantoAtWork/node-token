var express     = require('express'),
	router      = express.Router();

var db                  = require('../../core/database'),
	Users               = require('../../models/users'); // get our lokijs model

var Memory      = require('../../core/memory'),
	middlewares = require('./middlewares');

// globals
var APP_ROOT_PATH = Memory.get('APP_ROOT_PATH');
// declare 'log' function
eval("var log = " + require(APP_ROOT_PATH + '/log'));

var elements_available = ['uuid', 'name'],
	elements_required  = ['uuid'];

var elements    = require(APP_ROOT_PATH + '/app/lib/elements');


router.route('/user')
	.all(   function (appReq, appRes, next) {
 		// runs for all HTTP verbs first
 		// think of it as route specific middleware!
 		next();
 	})
 	.get(
 		middlewares.route_validateToken, 
 		middlewares.route_requireRole('admin'),  
 		function (appReq, appRes, next) {
 		// RETRIEVE: see own user account
 		Users()
 			.done(function(users){
 				var user_uuid = appReq.decoded.sub;

 				var me = users.findOne({'uuid': user_uuid});

 				var output = {
 					success: true,
 					data: me
 				}
 				appRes.json(output);

			}, 
			middlewares.onError.bind(appRes))
 	})
 	.post(
 		middlewares.route_validateToken,  
 		function (appReq, appRes, next) {
 		// ADD: see own user account
 		Users()
 			.done(function(users){
 				var user_uuid = appReq.decoded.sub;
 				var queryData = appReq.body;
 				var acceptedPostData = elements.availableElements(elements_available, queryData);
 				var validated = elements.checkElementsNotEmptyString(elements_required, queryData);

				// condition: some fields can't be empty
				if(!validated) {
					appRes.status(403).send({
						status: false,
						value: elements_required+": is required and can not be empty"
					});
					return;
				}
 				// INSERT user
 				var inserted_user    = users.insert( acceptedPostData );

 				var output = {
 					success: true,
 					data: inserted_user
 				}
 				appRes.json(output);

			}, 
			middlewares.onError.bind(appRes))
 	});

router.route('/user/:id')
	.all(   function (appReq, appRes, next) {
 		// runs for all HTTP verbs first
 		// think of it as route specific middleware!
 		next();
 	})
	.get(
		// middlewares.route_validateToken, 
		// middlewares.route_requireRole('admin'), 
		function (appReq, appRes, next) {
			// RETRIEVE: User ID
			Users()
				.done(
					function(user) {
						var id = Number(appReq.params.id);
						var found_user = user.get(id);
						log(found_user);

						if(found_user) {
							appRes.json({
								success: true,
								message: 'User Retrieved',
								data: found_user
							});
						} else {
							appRes.status(403).json({
								success: false,
								message: "User does not exist" 
							});
						}
					},
					middlewares.onError.bind(appRes));
	})
	.put(
		middlewares.route_validateToken, 
		middlewares.route_requireRole('admin'), 
		function (appReq, appRes, next) {
			// UPDATE: User ID
			Users()
				.done(
					function(user) {
						var id = Number(appReq.params.id);
						var found_user = user.get(id);
						log(found_user);


						if(found_user) {
							// user.update(found_user);

							appRes.json({
								success: true,
								message: 'User Updated',
								data: found_user
							});
						} else {
							appRes.status(403).json({
								success: false,
								message: "User does not exist" 
							});
						}
					},
					middlewares.onError.bind(appRes));
	})
	.delete(
		middlewares.route_validateToken, 
		middlewares.route_requireRole('admin'), 
		function (appReq, appRes, next) {
			// DELETE: User ID
			Users()
				.done(
					function(user) {
						var id = Number(appReq.params.id);
						var found_user = user.get(id);
						log(found_user);

						if(found_user) {
							// user.remove(found_user);

							appRes.json({
								success: true,
								message: 'User Deleted',
								data: found_user
							});
						} else {
							appRes.status(403).json({
								success: false,
								message: "User does not exist" 
							});
						}
					},
					middlewares.onError.bind(appRes));
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
			}, middlewares.onError.bind(res));
});



module.exports = router;