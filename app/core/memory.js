// Memory Manager use of LokiJS

var loki = require('lokijs');
var db = new loki('memory');

// converts
var toBase64 = function(string) { return new Buffer(string).toString('base64') };
var toString = function(base64) { return new Buffer(base64, 'base64').toString('utf8') };

// database collection: memory
var Memory = db.getCollection('memory');
if (!Memory) { 
	Memory = db.addCollection('memory', { unique: ["name"] } ) };

module.exports = {
	get: function (name) {
		try	{
			var record = Memory.findOne({ 'name': name });
			if (record) {
				return toString(record.value);
			}
			return null;
		} catch(e) {
			return null;
		}
	},

	set: function (name, value) {
		var key = Memory.findOne({ 'name': name });

		var record = {
			name: name,
			value: toBase64(value)
		};

		if (key) { Memory.update(record) 
		} else { Memory.insert(record) }

		return value;
	}
}
