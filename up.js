var args = {};
process.argv.forEach(function (val, index, array) {
  args = {ip: val};
});

var arDrone = require('ar-drone');
var client = arDrone.createClient(args);

client.takeoff(function() {
	this.up(1);
	this.after(1000, function() {
		this.stop();
	}).after(5000, function() {
		this.stop();
	});
});
