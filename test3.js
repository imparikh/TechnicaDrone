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


client.on('navdata', function(data) {
	if (data.demo && state != STATE_FLIPPING) {
		z = data.demo.altitude;
		//console.log(data.demo.altitude);
	}
});

client.takeoff(function() {
	//client.calibrate(0)
	//client.after(2000, function(){
		state = STATE_GOINGTOZ;
		setInterval(update, 500)	
	//})	
});


	function update(){	
		if (state == STATE_GOINGTOZ) {
			distanceZ = tarAltitude - z;
			zInRange = Math.abs(z - tarAltitude) <= (EPSILON * INCHESTOMETER) / 2;
			console.log("STATE_GOINGTOZ. Am at " + z + " = " + zInRange + " EPSILON= " + (EPSILON * INCHESTOMETER)/ 2 + " distZ= "+ distanceZ);
			if (zInRange){
				console.log("In Range Z")
				client.stop()
				state = STATE_FLIPPING
				flipper()
				setTimeout(function(){
					state = STATE_GOINGTOZ
				}, 3000)
			}
			else if(z < tarAltitude){
				client.up(0.4)
			}
			else{
				client.down(0.4)
			}
		}
		else if (state == STATE_GOINGTOY){
			console.log("Doing Y things")
			distanceY = tarAltitude - y;
			yInRange = Math.abs(y - tarY) <= (EPSILON * INCHESTOMETER) / 2;
			console.log("STATE_GOINGTOY. Am at " + y + " = " + yInRange + " EPSILON= " + (EPSILON * INCHESTOMETER) / 2 + " distY= "+ distanceY);
			if (yInRange){
				console.log("In Range Y")
				client.stop()
				//state = STATE_FLIPPING
				//flipper()
				setTimeout(function(){
					state = STATE_GOINGTOX
				}, 3000)
			}
			else if(tarY < y){
				client.front(0.01)
			}
			else{
				client.back(0.01)
			}
		}
		else if (state == STATE_GOINGTOX){
			distanceX = tarX - x;
			xInRange = Math.abs(x - tarX) <= (EPSILON * INCHESTOMETER) / 2;
			console.log("STATE_GOINGTOY. Am at " + y + " = " + yInRange + " EPSILON= " + (EPSILON * INCHESTOMETER) / 2 + " distY= "+ distanceY);
			if (xInRange){
				console.log("In Range X")
				client.stop()
				if (tarAltitude != 0.5){
					state = STATE_FLIPPING
					flipper()
					setTimeout(function(){
						state = STATE_GOINGTOZ
						tarX = 7.5
						tarY = 7.5
						tarAltitude = 0.5
					}, 3000)
				}else {
					client.land()
				}
			}
			else if(tarX < x){
				client.left(0.01)
			}
			else{
				client.right(0.01)
			}
		}
	}

function flipper(){
	console.log("Flipping")
	client.animate('flipLeft', 100)
}





















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