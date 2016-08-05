var _uuid   = require('node-uuid');
var Memory = require('../core/memory');

var uuid = Memory.get('uuid');
console.log('-- Memory - uuid: '+uuid);
if (!uuid) {
	uuid = Memory.set('uuid', _uuid.v4());
}


module.exports = uuid.v4();