var express     = require('express'),
	_uuid       = require('node-uuid');

var router              = express.Router();
var Users               = require('../models/users'), // get our lokijs model
	User_credentials    = require('../models/user_credentials'), // get our lokijs model
	db                  = require('../core/database'),
	credential_data     = require('../config/setup_config');

// for logging
eval("var log = " + require('../../log'));

router.get('/setup', function(req, res) {
	//create a sample user

	var uuid = _uuid.v1();

	// compose data
	var data = credential_data;

	// Load Users_credentials -table
	User_credentials()
		.done(function(credentials){
			// Load Users -table
			Users()
				.done(function(users){
					var found_credential,
						credential,
						found_user,
						user;

					found_credential = credentials.findOne({ 'username': data.user_credentials.username });
					found_user       = users.findOne({ 'uuid': uuid });

					if (!found_credential) {
						inserted_credential = credentials.insert( data.user_credentials );

						try {
							db.saveDatabase();
							log('credentials saved');

							if(!found_user) {
								inserted_user       = users.insert( data.user );
								log('user saved');

							} else {
								updated_user        = users.update( data.user );
								log('user updated');
							}
							db.saveDatabase();

							return res.json({
								success: true,
								data: inserted_user
							})

						} catch(err) {
							return res.json({ 
							success: false, 
							message: 'Saving credentials error' });
						}


					} else {
						return res.json({ 
							success: false, 
							message: 'User already exist' });
					}

				});

		}, res.send.bind(res))

	// return to route
});

module.exports = router;