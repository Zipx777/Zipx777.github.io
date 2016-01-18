//Puck class
var Puck = function(startX, startY) {
	var x = startX,
		y = startY,
		color = "gray",
		radius = 8,
		xSpeed = 4,
		ySpeed = 4;
	
	//return value of x
	var getX = function() {
		return x;
	};
		
	//return value of y
	var getY = function() {
		return y;
	};
	
	//return puck color
	var getColor = function() {
		return color;
	};
	
	//return puck radius
	var getRadius = function() {
		return radius;
	}
	
	//set new value for x
	var setX = function(newX) {
		x = newX;
	};
	
	//set new value for y
	var setY = function(newY) {
		y = newY;
	};
	
	var reset = function() {
		color = "gray";
	}
	
	//updates puck position
	//paramters: c is the canvas context, p is the players array
	var update = function(c, p) {
		x += xSpeed;
		y += ySpeed;
		
		//check for collisions, update puck speed and color
		checkForCollisionWithPlayers(p);
		checkForCollisionWithWall(c);		
	};
	
	//draws the puck
	var draw = function(ctx) {
		ctx.fillStyle = color;
		ctx.fillRect(x - radius, y - radius, radius*2, radius*2);
	};
	
	function checkForCollisionWithPlayers(players) {	
		var i;
		for (i = 0; i < players.length; i++) {			
			var xDiff = x - players[i].getX();
			var yDiff = y - players[i].getY();
			var combinedRadii = radius + players[i].getRadius();
						
			if ((Math.abs(xDiff) <= combinedRadii) && (Math.abs(yDiff) <= combinedRadii)) {
				//the puck has collided with a player
				color = players[i].getColor();
				
				//calculate physics result of the collision, change puck's speed
				handlePuckPlayerCollision(players[i]);
			}
		}
	}
	
	/*
	calculate physics of a collision between the puck and a player
	Physics rules #1:
		puck is sent in the direction of whatever quadrant of the player it hit
		example: hit top left corner of player, puck starts moving up and to the left
		ignores puck's previous speed
	*/
	function handlePuckPlayerCollision(p) {
		var xDiff = x - p.getX();
		var yDiff = y - p.getY();
		
		if (xDiff < 0) {
			xSpeed = -1 * Math.abs(xSpeed);
		} else if (xDiff > 0) {
			xSpeed = Math.abs(xSpeed);
		}
		
		if (yDiff < 0) {
			ySpeed = -1 * Math.abs(ySpeed);
		} else if (yDiff > 0) {
			ySpeed = Math.abs(ySpeed);
		}
	}
	
	function checkForCollisionWithWall(ctx) {
		var rightEdge = x + radius;
		var leftEdge = x - radius;
		var topEdge = y - radius;
		var bottomEdge = y + radius;
		
		if (rightEdge > ctx.canvas.width) {
			xSpeed = -1 * Math.abs(xSpeed);
		} else if (leftEdge < 0) {
			xSpeed = Math.abs(xSpeed);
		}
		
		if (bottomEdge > ctx.canvas.height) {
			ySpeed = -1 * Math.abs(ySpeed);
		} else if (topEdge < 0) {
			ySpeed = Math.abs(ySpeed);
		}
	}
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getRadius: getRadius,
		getColor: getColor,
		setX: setX,
		setY: setY,
		reset: reset,
		update: update,
		draw: draw
	};	
};
