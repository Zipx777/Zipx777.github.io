//Player class
var Player = function(startX, startY, pColor) {
	var x = startX,
		y = startY,
		color = pColor || "black",
		radius = 12,
		speed = 6;
		
	//return value of x
	var getX = function() {
		return x
	};
		
	//return value of y
	var getY = function() {
		return y;
	};
	
	//return player color
	var getColor = function() {
		return color;
	};
	
	//return player radius
	var getRadius = function() {
		return radius;
	};
		
	//set new value for x
	var setX = function(newX) {
		x = newX;
	};
	
	//set new value for y
	var setY = function(newY) {
		y = newY;
	};
	
	//set new value for color
	var setColor = function(newColor) {
		color = newColor;
	};
	
	//set new value for radius
	var setRadius = function(newRadius) {
		radius = newRadius;
	};
	
	//update player position, return true if player's position changed
	//takes a Keys object as a parameter, with bools up, left, down, and right
	var update = function(keys) {		
		var prevX = x,
			prevY = y;
			
		if (keys.up) {
			y -= speed;
		}
		
		if (keys.down) {
			y += speed;
		}
		
		if (keys.left) {
			x -= speed;
		}
		
		if (keys.right) {
			x += speed;
		}
		
		return ((prevX != x) || (prevY != y));
	};
	
	//draws player on canvas context passed to it
	var draw = function(ctx) {
		ctx.fillStyle = color;
		ctx.fillRect(x - radius, y - radius, radius*2, radius*2);
	};
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getColor: getColor,
		getRadius: getRadius,
		setX: setX,
		setY: setY,
		setColor: setColor,
		setRadius: setRadius,
		update: update,
		draw: draw
	};
};
