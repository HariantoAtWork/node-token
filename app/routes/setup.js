var express     = require('express'),
	_uuid       = require('node-uuid');

var router      = express.Router();
var Users       = require('../models/users'), // get our lokijs model
	db          = require('../core/database');

router.get('/setup', function(req, res) {
	//create a sample user

	// compose data
	var user = {
		uuid: _uuid,
		name: 'Harianto van Insulinde',
		password: 'Hariant0',
		admin: true
	};

	Users()
		.done(function(users){
			var found = users.findOne({ 'name': user.name });

			if(!found) {
				// insert record to Users
				var item = users.insert(user);
				try {
					// Users.update(user);
					db.saveDatabase();
					
					res.json({
						success: true,
						data: item
					})
				} catch(err) {
					res.json({
						success: false,
						message: err
					})
				}
			} else {
				res.json({ 
					success: false, 
					message: 'User already exist' });
				
			}

		}, res.send.bind(res))

	// return to route
});

module.exports = router;