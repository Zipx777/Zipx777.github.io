//Projectile class
var Projectile_Homing = function(startX, startY, startFacingVector, startSpeed) {
	var x = startX || 0,
		y = startY || 0,
		speed = startSpeed || 3,
		color = "purple",
		radius = 4,
		facingVector = startFacingVector || new Vector(1,0),
		rotationSpeed = 2,
		targetInFront = false,
		targetInFrontAngle = 90,
		inBounds = true;

	//return value of x
	var getX = function() {
		return x;
	};

	//return value of y
	var getY = function() {
		return y;
	}

	//return speed value
	var getSpeed = function() {
		return speed;
	}

	//return facingVector
	var getFacingVector = function() {
		return facingVector;
	}

	//set new value for x
	var setX = function(newX) {
		x = newX;
	}

	//set new value for y
	var setY = function(newY) {
		y = newY;
	}

	//set speed value
	var setSpeed = function(newSpeed) {
		speed = newSpeed;
	}

	//set facingVector
	var setFacingVector = function(newFacingVector) {
		facingVector = newFacingVector;
	}

	var isInBounds = function() {
		return inBounds;
	}

	var checkForCollisionWithPlayer = function(player) {
		var xDistBetween = x - player.getX();
		var yDistBetween = y - player.getY();
		var distBetweenSquared = Math.pow(xDistBetween, 2) + Math.pow(yDistBetween, 2);
		var combinedRadiiSquared = Math.pow(0.9 * player.getRadius(), 2);
		if (distBetweenSquared <= combinedRadiiSquared) {
			return true;
		} else {
			return false;
		}
	}

	//update projectile position
	var update = function(player) {
		var playerX = player.getX();
		var playerY = player.getY();

		var vectorToPlayer = new Vector(playerX - x, playerY - y);

		//avoid divide-by-zero error if player is directly on top of turret
		if (vectorToPlayer.length() > 0) {
			playerDirection = vectorToPlayer.normalize();
		}

		var turretDotPlayer = facingVector.dot(vectorToPlayer);
		var turretCrossPlayer = facingVector.cross(vectorToPlayer);
		var signedAngleBetween = Math.atan2(turretCrossPlayer, turretDotPlayer);

		//##########################################
		//###########  UPDATE FACING  ##############
		//##########################################

		if (Math.abs(signedAngleBetween) * 180 / Math.PI < rotationSpeed) {
			//snap to target if aim is less than <rotationSpeed> away to avoid flickering
			facingVector = vectorToPlayer;
			targetInFront = true;
		} else {
			if (Math.abs(signedAngleBetween) < (targetInFrontAngle * Math.PI / 180)) {
				targetInFront = true;
			} else {
				targetInFront = false;
			}
		}

		if (targetInFront) {
			var angleChange = (signedAngleBetween / Math.abs(signedAngleBetween)) * rotationSpeed;

			var newTurretAngle = facingVector.toAngle() + (angleChange * Math.PI / 180);

			var newFacingVector = new Vector(Math.cos(newTurretAngle), Math.sin(newTurretAngle));

			facingVector = newFacingVector.normalize();
		}

		var velocity = facingVector.normalize().multiply(speed);
		x = x + velocity.getX();
		y = y + velocity.getY();

		if (x < 0 || x > ctx.canvas.width || y < 0 || y > ctx.canvas.height) {
			inBounds = false;
		}
	}

	//draws projectile on canvas context passed to it
	var draw = function(ctx) {
		ctx.save();
		ctx.translate(x,y);

		var angle = facingVector.toAngle();
		ctx.rotate(angle);

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(2 * radius, 0);
		ctx.lineTo(-1 * radius, -1 * radius);
		ctx.lineTo(-0.5 * radius, 0);
		ctx.lineTo(-1 * radius, radius)
		ctx.fill();

		ctx.restore();
	}

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getSpeed: getSpeed,
		getFacingVector: getFacingVector,
		setX: setX,
		setY: setY,
		setSpeed: setSpeed,
		setFacingVector: setFacingVector,
		isInBounds: isInBounds,
		checkForCollisionWithPlayer: checkForCollisionWithPlayer,
		update: update,
		draw: draw
	};
};
