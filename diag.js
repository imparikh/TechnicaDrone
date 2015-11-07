var args = {};
process.argv.forEach(function (val, index, array) {
	if (index < 2 || val == 'ip') return;
	args = {ip: val};
});

var arDrone = require('ar-drone');
var client  = arDrone.createClient(args);

client.takeoff(function() {
	this.right(0.1);
	this.front(0.1);
	this.after(1000, function() {
		this.stop();
	}).after(5000, function() {
		this.land();
	});
});
