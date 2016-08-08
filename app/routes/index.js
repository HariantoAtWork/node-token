var express     = require('express');
var router      = express.Router();

var db          = require('../core/database'); 

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

router.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});



module.exports = router;