var express     = require('express');
var router      = express.Router();

var db          = require('../core/database'); 


router.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});



module.exports = router;