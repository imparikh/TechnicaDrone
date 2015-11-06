var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var tarAltitude = 1.8
var tarX = 7.5
var tarY = 7.5
var x = 7.5
var y = 7.5
var z = 0
var velocity
var readyToGoTarget = false;
var readyToGoHome = false;
var executedFlip = false;

var INCHESTOMETER = 0.0254
var EPSILON = 4
var ALTEPSILON = EPSILON * INCHESTOMETER

var STATE_PRE = 0;
var STATE_TAKEOFF = 1;
var STATE_GOINGTOTARG = 2;
var STATE_FLIPPING = 3;
var STATE_GOINGHOME = 4;
var STATE_READYTOLAND 5;
var state = STATE_TAKEOFF;

client.takeoff(function(){
	state = STATE_GOINGTOTARG
})

getInformation(password, function(data){
	tarX = data.xcoord/100 * 15
	tarY = data.ycoord/100 * 10
})
client.on('navdata', function(data){
	if (state == STATE_GOINGTOTARG || state == STATE_GOINGHOME){
		if (state == STATE_GOINGHOME){
			tarY = 7.5
			tarX = 7.5
		}
		z = data.demo.altitude;
		velocity = data.demo.velocity

		distanceZ = tarAltitude - z
		zInRange = Math.abs(z - tarAltitude) <= EPSILON
		zAdjuster(zInRange, distanceZ)

		distanceY = tarY - y
		yInRange = Math.abs(y - tarY) <= EPSILON
		yAdjuster(yInRange, distanceY)

		distanceX = tarX - x
		xInRange = Math.abs(y-tarY) <= EPSILON
		xAdjuster(xInRange, distanceX)


		if (xInRange && yInRange && zInRange && state == STATE_GOINGTOTARG){
			state = STATE_FLIPPING;
			client.animate('flipLeft', 100)
			setTimeout(function (){state = STATE_GOINGHOME}, 5000);
		}

		if (xInRange && yInRange && state == STATE_GOINGHOME){
			client.stop()
			client.land()
			state = STATE_READYTOLAND
		}
	}
}

		
function zAdjuster(zInRange, distanceZ){
	if (!zInRange){
		stabilizeZ(distanceZ)
	}else {
		client.up(0)
		client.down(0)
	}
}

function yAdjuster(yInRange, distanceY){
	if (!zInRange){
		stabilizeZ(distanceY)
	}else {
		client.front(0)
		client.back(0)
	}
}


function xAdjuster(xInRange, distanceX){
	if (!xInRange){
		stabilizeX(distanceX)
	}else {
		client.right(0)
		client.left(0)
	}
}


function stabilizeZ(dist){
	if (dist > 0){
		client.up(0.05)
	}
	else{
		client.down(0.05)
	}
}

function stabilizeY(dist){
	if (dist > 0){
		client.back(0.05)
	}
	else{
		client.front(0.05)
	}
}

function stabilizeX(dist){
	if (dist > 0){
		client.right(0.05)
	}
	else{
		client.left(0.05)
	}
}
/*function takeoff_fixed_height() {
	client.takeoff(function() {
		this.up(1);
		this.after(1500, function() {
			this.stop()
		})
		.after(4000, function() {

  			this.animate('flipLeft', 100);
  			//stabilize
  		})
  		.after(5000, function() {
	    	this.stop();
	   		this.land();
	  	})
	});
}*/