//Circle class
var Circle = function(startX, startY, startXSpeed, startYSpeed, startColor) {
	var x = startX,
		y = startY,
		color = startColor || "black",
		radius = 12,
		xSpeed = startXSpeed || 5,
		ySpeed = startYSpeed || 5;
		
	//return value of x
	var getX = function() {
		return x;
	};
		
	//return value of y
	var getY = function() {
		return y;
	};
	
	//return circle color
	var getColor = function() {
		return color;
	};
	
	//return circle radius
	var getRadius = function() {
		return radius;
	};
	
	//get xSpeed
	var getXSpeed = function() {
		return xSpeed;
	};
	
	//get ySpeed
	var getYSpeed = function() {
		return ySpeed;
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
	
	//set xSpeed
	var setXSpeed = function(newXSpeed) {
		xSpeed = newXSpeed;
	};
	
	//set ySpeed
	var setYSpeed = function(newYSpeed) {
		ySpeed = newYSpeed;
	};
	
	//adjust circle's speed based on collision with another circle
	//also adjusts other circle's speed (tentative testing)
	//assumes circles have collided and are moving towards each other at least a little bit
	var collisionWithCircle = function(c) {
		
		var angleBetweenCircs;
		var speed1, newSpeed1, angle1, newAngle1, paraSpeed1, newParaSpeed1, perpSpeed1;
		var speed2, newSpeed2, angle2, newAngle2, paraSpeed2, newParaSpeed2, perpSpeed2;

		angle1 = Math.atan2(ySpeed, xSpeed);
		angle2 = Math.atan2(c.getYSpeed(), c.getXSpeed());
		angleBetweenCircs = Math.atan2(y - c.getY(), x - c.getX());

		speed1 = Math.sqrt(Math.pow(xSpeed, 2) + Math.pow(ySpeed, 2));
		speed2 = Math.sqrt(Math.pow(c.getXSpeed(), 2) + Math.pow(c.getYSpeed(), 2));
		
		paraSpeed1 = speed1 * Math.cos(angle1 - angleBetweenCircs);
		paraSpeed2 = speed2 * Math.cos(angle2 - angleBetweenCircs);
		
		perpSpeed1 = speed1 * Math.sin(angle1 - angleBetweenCircs);
		perpSpeed2 = speed2 * Math.sin(angle2 - angleBetweenCircs);
		//alert("2");
		newParaSpeed1 = paraSpeed2;
		newParaSpeed2 = paraSpeed1;
		
		newAngle1 = Math.atan2(perpSpeed1, newParaSpeed1) + angleBetweenCircs;
		newAngle2 = Math.atan2(perpSpeed2, newParaSpeed2) + angleBetweenCircs;
		//alert("3");
		newSpeed1 = Math.sqrt(Math.pow(perpSpeed1, 2) + Math.pow(newParaSpeed1, 2));
		newSpeed2 = Math.sqrt(Math.pow(perpSpeed2, 2) + Math.pow(newParaSpeed2, 2));
		
		xSpeed = newSpeed1 * Math.cos(newAngle1);
		ySpeed = newSpeed1 * Math.sin(newAngle1);
		
		c.setXSpeed(newSpeed2 * Math.cos(newAngle2));
		c.setYSpeed(newSpeed2 * Math.sin(newAngle2));	
			
	};
	
	//update Circle position and speed
	var update = function(ctx, g, cor) {		
		x += xSpeed;
		y += ySpeed;		
				
		checkForCollisionWithWall(ctx, g, cor);
		ySpeed += g;
	};
	
	//bounces the circle off of a wall
	function checkForCollisionWithWall(c, g, cor) {
		if (x < 0) {
			xSpeed = Math.abs(xSpeed);
		} else if (x + (radius * 2) > c.canvas.width) {
			xSpeed = -1 * Math.abs(xSpeed);
		}
		
		/*unused collision check for ceiling, circles can fly above the ceiling
		if (y < 0) {
			ySpeed = Math.abs(ySpeed);
		}
		*/
		
		if (y + (radius * 2) > c.canvas.height) {
			ySpeed = -1 * Math.abs(ySpeed) * cor;
			
			/*
			Stop circle oscillation if ySpeed is low enough.
			Make it look nicer, instead of seeming to
			vibrate at low speeds along the ground.
			*/
			if (Math.abs(ySpeed) < 1) {
				ySpeed = 0;
				y = c.canvas.height - (radius * 2);
			}
			/*
			Depending on whether g is added to ySpeed before of after floor collisions, 
			circles gain/lose speed when hitting the floor unless next line is included.
			Potentially remove this for Funsics? could be the source of random speed
			*/
			ySpeed -= g;
		}
	}
	
	//draws player on canvas context passed to it
	var draw = function(ctx) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI, true);
		ctx.fill();
	};
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getColor: getColor,
		getRadius: getRadius,
		getXSpeed: getXSpeed,
		getYSpeed: getYSpeed,
		setX: setX,
		setY: setY,
		setColor: setColor,
		setRadius: setRadius,
		setXSpeed: setXSpeed,
		setYSpeed: setYSpeed,
		collisionWithCircle: collisionWithCircle,
		update: update,
		draw: draw
	};
};
