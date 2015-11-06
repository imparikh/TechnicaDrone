var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var tarAltitude = 1.5
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

var STATE_TAKEOFF = 1;
var STATE_GOINGTOZ = 2;
var STATE_GOINGTOY = 3;
var STATE_GOINGTOX = 4;
var STATE_FLIPPING =5;
var state = STATE_TAKEOFF;

var password = 'areio;flkdbn&!!@$Nick23Hi'

client.on('navdata', function(data) {
	if (data.demo) {
		z = data.demo.altitude;
		//console.log(data.demo.altitude);
	}
});

client.takeoff(function() {
	state = STATE_GOINGTOZ;

	setInterval(function(){
		if (state == STATE_GOINGTOZ) {
			distanceZ = tarAltitude - z;
			zInRange = Math.abs(z - tarAltitude) <= (EPSILON * INCHESTOMETER);
			console.log("STATE_GOINGTOZ. Am at " + z + " = " + zInRange + " EPSILON= " + (EPSILON * INCHESTOMETER) + " distZ= "+ distanceZ);
			if (zInRange){
				console.log("In Range!!!!")
				client.stop()
				state = STATE_GOINGTOY
				client.after(4000, function() {
					this.animate('flipLeft', 100)
				})
				.after(1000, function() {
					this.stop()
				})
			}
			else if(z < tarAltitude){
				client.up(0.2)
			}
			else{
				client.down(0.2)
			}
		}
	}, 500);
});






















/*
getInformation(password, function(data){
	tarX = data.xcoord/100 * 15
	tarY = data.ycoord/100 * 10
})
*/

/*client.on('navdata', function(data){
	if (state == STATE_GOINGTOTARG || state == STATE_GOINGHOME){
		if (state == STATE_GOINGHOME){
			tarY = 7.5
			tarX = 7.5
		}
		z = data.demo.altitude;
		console.log(z + ' current z value')
		velocity = data.demo.velocity

		distanceZ = tarAltitude - z
		zInRange = Math.abs(z - tarAltitude) <= (EPSILON * INCHESTOMETER)
		zAdjuster(zInRange, distanceZ)

		distanceY = tarY - y
		yInRange = Math.abs(y - tarY) <= EPSILON
		yAdjuster(yInRange, distanceY)

		distanceX = tarX - x
		xInRange = Math.abs(y-tarY) <= EPSILON
		xAdjuster(xInRange, distanceX)
		console.log(xInRange + ' ' + yInRange)
		console.log(zInRange)

		if (xInRange && yInRange && zInRange && state == STATE_GOINGTOTARG){
			console.log("ready to flip")
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
})

		
function zAdjuster(zInRange, distanceZ){
	console.log(distanceZ)
	if (!zInRange){
		console.log("Z is adjusting")
		stabilizeZ(distanceZ)
	}else {
		console.log("Z is in target zone")
		client.up(0)
		client.down(0)
	}
}

function yAdjuster(yInRange, distanceY){
	console.log("SHOULD NOT PRINT Y")
	if (!zInRange){
		stabilizeZ(distanceY)
	}else {
		client.front(0)
		client.back(0)
	}
}


function xAdjuster(xInRange, distanceX){
	console.log("SHOULD NOT PRINT X")
	if (!xInRange){
		stabilizeX(distanceX)
	}else {
		client.right(0)
		client.left(0)
	}
}


function stabilizeZ(dist){
	if (dist > 0){
		console.log("should go up")
		client.up(0.4)
	}
	else{
		client.down(0.2)
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
}*/
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