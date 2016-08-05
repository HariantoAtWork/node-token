var loki = require('lokijs');
var db = new loki(require('../../config').database);
module.exports = db;