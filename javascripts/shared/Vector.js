var Vector = function(startX, startY) {
	var x = startX,
		y = startY;
	
	var getX = function() {
		return x;
	}
	
	var getY = function() {
		return y;
	}
	
	var setX = function(newX) {
		x = newX;
	}
	
	var setY = function(newY) {
		y = newY;
	}
	
	var length = function() {
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	}
	
	var multiply = function(c) {
		x = x * c;
		y = y * c;
		return new Vector(x,y);
	}
	
	var dot = function(v) {
		return x * v.getX() + y * v.getY();
	}
	
	var cross = function(v) {
		return x * v.getY() - y * v.getX();
	}
	
	var angleTo = function(v) {
		var tempDot = x * v.getX() + y * v.getY();
		var v1Length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		var v2Length = Math.sqrt(Math.pow(v.getX(), 2) + Math.pow(v.getY(), 2));
		return Math.acos(tempDot / (v1Length * v2Length));
	}
	
	var toAngle = function() {
		return -1 * Math.atan2(-1 * y, x);
	}
	
	var normalize = function() {
		var vLen = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		x = x / vLen;
		y = y / vLen;
		return new Vector(x,y);
	}
	
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		length: length,
		multiply: multiply,
		dot: dot,
		cross: cross,
		angleTo: angleTo,
		toAngle: toAngle,
		normalize: normalize
	};
};
