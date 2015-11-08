var request = require('request');
var fs = require('fs')
var http = require('http')

var tarAltitude = 0.752;
var tarX;
var tarY;
var x;
var y;
var z = 0;

var oldPos;

var velocity = {'x': 0, 'y':0, 'z':0};

//get the password
var pw = fs.readFile('./password', 'utf8', function (err, data) {
	if (err) {
	    return console.log(err);
	}
	return data.toString();
});

var args = {};
process.argv.forEach(function (val, index, array) {
        if (index < 2 || val == 'ip') return;
        args = {ip: val};
});

resetDropCounter(pw);
	
var arDrone = require('ar-drone');
var client  = arDrone.createClient(args);

var INCHESTOMETER = 0.0254
var EPSILON = 10
var ALTEPSILON = 0.06

var STATE_TAKEOFF = 1;
var STATE_GOINGDIAG = 2;
var STATE_FLIPPING = 3;
var STATE_READYTOGOHOME = 4;
var STATE_WAIT = 5;
var STATE_GOINGTOZ = 6;
var state = STATE_TAKEOFF;

var didWarn = false;
client.on('navdata', function(data) {
	if (data.demo && state != STATE_FLIPPING) {
		z = data.demo.altitude;
		//velocity = data.demo.velocity;
		if (data.demo.batteryPercentage <= 40 && !didWarn) {
			console.log('battery low');
			didWarn = true;
		}

		updateOverheadPosition();
	}

});

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {
	console.log('received data:', text);
	if (text === 'quit\n' || text === 'q\n') {
		aborter()
	}
	else if (text === 'go\n' || text === 'g\n'){
		continueOk()
	}
	else if (text === 'm\n'){
		client.stop()
		sleep = true;
	}
	else if (text === 'a\n'){
		client.left(0.100);
		client.front(0);
		client.back(0);
	}
	else if (text === 'w\n'){
		client.front(0.100);
		client.left(0);
		client.right(0);
	}
	else if (text === 's\n'){
		client.back(0.100)
		client.right(0);
		client.left(0);
	}
	else if (text === 'd\n'){
		client.right(0.100)
		client.front(0)
		client.back(0)
	}
	else{
		client.stop()
		console.log("HALT")
	}
});

function aborter() {
	console.log('Abort');
	client.land();
}
var count = 0
function continueOk(){
	console.log('go');
	
	getNextDrop(pw, function(data) {
		var drop = JSON.parse(data)

			// have next drop
		tarY = clamper(drop.ycoord)
		tarX = clamper(drop.xcoord)

		console.log(tarX + ", " + tarY)
	})
	starter()
}

var interval;

function clamper(targ){
	if (targ < 10)
		return 10;
	else if (targ > 75)
		return 75;
	else
		return targ;
}

function starter(){
	count ++
	client.takeoff(function() {
		updateOverheadPosition();
		//client.calibrate(0)
		state = STATE_GOINGDIAG;
		secondRun = false;
		if (!interval) interval = setInterval(update, 100);
	});
}

function resetDropCounter(the_password){
	request.post('http://drone.gotechnica.org/drops/reset', {form: {password: the_password}},
		function (error, response, body){
			if (error || response.statusCode != 200){
				console.log('Invalid password.');
			}
	});
}

function getNextDrop(the_password, callback){
	request.post('http://drone.gotechnica.org/drops/next', {form: {password: the_password}}, 
		function (error, response, body) {
			if (!error && response.statusCode == 200){
				callback(body);
			}
			else {
				console.log('Invalid password.');
			}
	});
}

var sleep = false;
var goHome = false;
var secondRun = false;
function update() {	
	console.log('the stae' + state);
	if (sleep){
		console.log("I am sleeping.")
		return;
	}
	
	if (state == STATE_GOINGDIAG && x) {
		console.log('x ' + x + ", " + y)
		//console.log('tarX ' + tarX + ", tarY " + tarY)
		dx = tarX - (x)
		//because weird dimensions
		dy = tarY - (y)
		//console.log('dx ' + dx + 'dy ' +dy)
		distance = Math.sqrt(dx * dx + dy * dy)
		speedX = dx / distance * 0.05
		speedY = dy / distance * 0.06
		if (oldPos && (x + velocity.x > 100 || x + velocity.x < 0 || 
			y + velocity.y > 100 || y + velocity.y < 0)) {
			oldPos = false;
			client.stop();
			velocity.x = 0;
			velocity.y = 0;
		}

		if (distance > EPSILON) {
			console.log('distance: ' + distance)
			move(speedX, speedY)
		}
		else {
			client.stop()
			if (!secondRun){
				console.log("ready to flip")
				gotoState(STATE_FLIPPING)
			}
			else{
				console.log("landing");
				client.land()
			}
		}

	}
	else if (state == STATE_FLIPPING){
		flipper()
		gotoState(STATE_GOINGDIAG, 5000);
		secondRun = true;
	}
}

function updateOverheadPosition() {
	request.get("http://127.0.0.1:8080", function(error, response, body){
		var position = body.split(",").map(Number);
		x = position[0];
		y = position[1];

		if (!oldPos) oldPos = {'x': position[0], 'y': position[0]};
		else if (state == STATE_GOINGDIAG) {
			velocity.x = (x - oldPos.x);
			velocity.y = (y - oldPos.y);
			oldPos.x = x;
			oldPos.y = y;

			console.log('x ' + x + ' oldx ' + oldPos.x);
		} else {
			//console.log('not within vel');
			velocity.x = 0;
			velocity.y = 0;
		}
	});
}

function gotoState(newState, delay) {
	delay = delay || 2000;
	sleep = true;
	state = newState;
	setTimeout(function(){
		sleep = false;
	}, delay);
}

function flipper(){
	console.log("Flipping")
	client.up(1)
	oldPos = false;

	client.animateLeds('blinkGreenRed', 5, 5)
	client.after(1000, function(){
		client.stop()
		tarX = 25
		tarY = 75
		client.animate('flipLeft', 100)
		
	});

	secondRun = true;
}

function move (speedX, speedY) {
	toTheRight = speedX > 0
	toTheFront = speedY < 0

	speedX = Math.abs(speedX)
	speedY = Math.abs(speedY)
	
	if (toTheRight && toTheFront){
		console.log("right front")
		client.right(speedX)
		client.front(speedY)
	}
	else if (!toTheRight && toTheFront){
		console.log("left front")
		client.left(speedX)
		client.front(speedY)
	}
	else if (toTheRight && !toTheFront){
		console.log("right back")
		client.right(speedX)
		client.back(speedY)
	}
	else if (!toTheRight && !toTheFront){
		console.log("left back")
		client.left(speedX)
		client.back(speedY)
	}		
}
