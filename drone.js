var arDrone = require('ar-drone');
var client  = arDrone.createClient();
//drop = result.json()
// convert percents to absolute coordinates
//x = (drop['xcoord'] / 100.0) * CANVAS_WIDTH_FEET
//y = (drop['ycoord'] / 100.0) * CANVAS_HEIGHT_FEET

x = 10
y = 3.75
//currX = CANVAS_WIDTH_FEET / 2
//currY = CANVAS_HEIGHT_FEET

currX = 7.5
currY = 7.5
var maxSpeed = 0.8333333 //feet per second
var desiredSpeed = 0.25 / maxSpeed //feet per second
var horizontalTime = Math.abs(x - currX) / desiredSpeed
var verticalTime = Math.abs(y - currY) / desiredSpeed

onAxis = x === currX

client.takeoff();

if (!onAxis){
	if (currX < x){
		client
		.after(5000, function(){
			this.right(desiredSpeed)
		})
		.after(horizontalTime, function(){
			this.stop()
			console.log("have moved right")
		})
		.after(5000, function(){
			this.front(desiredSpeed)
		})
		.after(verticalTime, function(){
			this.stop()
			console.log("have moved front")
		})
		.after(2000, function(){
			this.animate('flipLeft', 250)
		})
		.after(3000, function(){
			this.stop()
		})
		.after(2000, function(){
			this.left(desiredSpeed)
		})
		.after(horizontalTime, function(){
			this.stop()
		})
		.after(5000, function(){
			this.back()
		})
		.after(verticalTime, function(){
			this.stop()
		})
		.after(1000, function(){
			this.land()
		})
	}
	else{
		client
		.after(5000, function(){
			this.left(desiredSpeed)
		})
		.after(horizontalTime, function(){
			this.stop()
		})
		.after(5000, function(){
			this.front(desiredSpeed)
		})
		.after(verticalTime, function(){
			this.stop()
		})
		.after(2000, function(){
			this.animate('flipLeft', 250)
		})
		.after(3000, function(){
			this.right(desiredSpeed)
		})
		.after(horizontalTime, function(){
			this.stop()
		})
		.after(5000, function(){
			this.back()
		})
		.after(verticalTime, function(){
			this.stop()
		})
		.after(1000, function(){
			this.land()
		})
	}		
}
else{
	client
	.after(5000, function(){
		this.front(desiredSpeed)
	})
	.after(verticalTime, function(){
		this.stop()
	})
	.after(2000, function(){
		this.animate('flipLeft', 250)
	})
	.after(3000, function(){
		this.back()
	})
	.after(verticalTime, function(){
		this.stop()
	})
	.after(1000, function(){
		this.land()
	})
}
