// // get an instance of mongoose and mongoose.Schema
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// // set up a mongoose model and pass it using module.exports
// module.exports = mongoose.model('User', new Schema({ 
//     name: String, 
//     password: String, 
//     admin: Boolean 
// }));


// Return Promise
var db = require('../core/database');
var Promise = require('promise');

var users = db.getCollection('users');
if (!users) { 
	users = db.addCollection('users', { unique: ["name"] } ) };


module.exports = function () {
	return new Promise(function(fulfil, reject){
		db.loadDatabase({}, function () {
			fulfil(db.getCollection('users'));
		});
	});
};

