var express     = require('express'),
	router      = express.Router();



router.get('/', function (req, res, next) {
	res.json({
		success: true,
		message: 'API v1'
	});
})

router.use('/', require('./user'));

module.exports = router;