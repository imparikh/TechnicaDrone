var args = {};
process.argv.forEach(function (val, index, array) {
  args = {ip: val};
});

var arDrone = require('ar-drone');
var client  = arDrone.createClient(args);
client.createRepl();
