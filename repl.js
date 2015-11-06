var args = {};
process.argv.forEach(function (val, index, array) {
	if (index < 2 || val == 'ip') return;
	args = {ip: val};
});

var arDrone = require('ar-drone');
var client  = arDrone.createClient(args);
client.createRepl();
