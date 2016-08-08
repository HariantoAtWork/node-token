// for logging
module.exports = function() { var a = Array.prototype.slice.call(arguments); a.splice(0,0,'- '+require('path').basename(__filename)+' |'); console.log.apply(null, a) };
