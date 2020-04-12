//Player class
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		speed = 5,
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

	//return value of radius
	var getRadius = function() {
		return radius;
	};

	var takeDamage = function() {
		color = "gray";
	}

	//update Player position
	var update = function(targetX, targetY, ctx) {
		var vectorTowardsMouse = new Vector(targetX - x, targetY - y);
		if (vectorTowardsMouse.length() > speed) {
			vectorTowardsMouse = vectorTowardsMouse.normalize().multiply(speed);
		}

		x += vectorTowardsMouse.getX();
		y += vectorTowardsMouse.getY();

		//clamp position to within the canvas bounds
		x = Math.max(x, 0);
		y = Math.max(y, 0);
		x = Math.min(x, ctx.canvas.width);
		y = Math.min(y, ctx.canvas.height);
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
		getRadius: getRadius,
		takeDamage: takeDamage,
		update: update,
		draw: draw
	};
};
