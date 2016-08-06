// Return Promise
var db = require('../core/database');
var Promise = require('promise');

var table = 'user_credentials';

var collection = db.getCollection(table);
if (!collection) { 
	collection = db.addCollection(table, { unique: ["uuid"] } ) };


module.exports = function () {
	return new Promise(function(fulfil, reject){
		try {
			db.loadDatabase({}, function () {
				fulfil(db.getCollection(table)) });

		} catch(e) { reject({success: false, message: e}) }
	});
};