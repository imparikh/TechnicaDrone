var args = {};
process.argv.forEach(function (val, index, array) {
	if (index < 2 || val == 'ip') return;
	args = {ip: val};
});

var arDrone = require('ar-drone');
var client  = arDrone.createClient(args);

client.takeoff(function() {
	this.up(1);
	this.after(1000, function() {
		this.stop();
	}).after(5000, function() {
		this.animate('flipLeft', 100);
	}).after(5000, function() {
		this.land();
	});
});

