//Player class
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		speed = 20,
		color = "blue",
		radius = 10;
		
	//return value of x
	var getX = function() {
		return x;
	};
		
	//return value of y
	var getY = function() {
		return y;
	};
	
	//set new value for x
	var setX = function(newX) {
		x = newX;
	};
	
	//set new value for y
	var setY = function(newY) {
		y = newY;
	};
	
	//update Player position
	var update = function(targetX, targetY) {
		var vectorTowardsMouse = new Vector(targetX - x, targetY - y);
		if (vectorTowardsMouse.length() > speed) {
			vectorTowardsMouse = vectorTowardsMouse.normalize().multiply(speed);
		}
		x += vectorTowardsMouse.getX();
		y += vectorTowardsMouse.getY();
	}
	
	//draws player on canvas context passed to it
	var draw = function(ctx) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
		ctx.fill();
	};
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw
	};
};