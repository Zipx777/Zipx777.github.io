//Goal class
var Goal = function(startX, startY, ori) {
	var x = startX,
		y = startY,
		color = "gray",
		longSide = 180,
		shortSide = 16,
		orientation = ori; //either "horizontal" or "vertical"
	
	var width, height;
	if (orientation == "horizontal") {
		width = longSide;
		height = shortSide;
	} else if (orientation == "vertical") {
		width = shortSide;
		height = longSide;
	}
	
	//get goal width
	var getWidth = function() {
		return width;
	};
	
	//get goal height
	var getHeight = function() {
		return height;
	};
	
	//set goal color
	var setColor = function(newColor) {
		color = newColor;
	};
	
	//reset the goal to starting state
	var reset = function() {
		color = "gray";
	}
	
	//update the goal, change color if collision with puck
	var update = function(puck) {
		var xDiff, yDiff, combinedWidth, combinedHeight;
		xDiff = Math.abs(puck.getX() - x);
		yDiff = Math.abs(puck.getY() - y);
		
		combinedWidth = (width / 2) + puck.getRadius();
		combinedHeight = (height / 2) + puck.getRadius();
		
		if (xDiff <= combinedWidth && yDiff <= combinedHeight) {
			color = puck.getColor();
		}
	};
	
	//draw the goal
	var draw = function(ctx) {
		ctx.fillStyle = color;
		ctx.fillRect(x - (width / 2), y - (height / 2), width, height);
	};
	
	// Define which variables and methods can be accessed
	return {
		getWidth: getWidth,
		getHeight: getHeight,
		setColor: setColor,
		reset: reset,
		update: update,
		draw: draw
	};
};
