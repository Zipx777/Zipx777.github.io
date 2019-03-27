//Turret class
var Turret = function(startX, startY, startRadius, startRotationSpeed, startFacingVector) {
	var x = startX,
		y = startY,
		color = "orangered",
		radius = startRadius || 12,
		rotationSpeed = startRotationSpeed || 1,
		facingVector = startFacingVector || new Vector(1,0),
		playerDirection = new Vector(1,0),
		delayBetweenShots = 5,
		burstLength = 5,
		currentShotsFiredInBurstCount = 0,
		firingDelay = 100,
		tickCount = 0,
		lastShotFiredTick = 0,
		playerFirstSeenTick = 0,
		aimedAtTarget = false,
		targetInFront = false;
		
	//return value of x
	var getX = function() {
		return x;
	};
		
	//return value of y
	var getY = function() {
		return y;
	};
	
	var getFacingVector = function() {
		return facingVector;
	}
	
	var getVectorToPlayer = function() {
		return vectorToPlayer;
	}
	
	//set new value for x
	var setX = function(newX) {
		x = newX;
	};
	
	//set new value for y
	var setY = function(newY) {
		y = newY;
	};
	
	var setFacingVector = function(newFacingVector) {
		facingVector = newFacingVector;
	}
	
	var setVectorToPlayer = function(newVectorToPlayer) {
		vectorToPlayer = newVectorToPlayer.normalize();
	}
	
	//update Turret rotation/facing
	var update = function(playerX, playerY, projectiles) {
		tickCount += 1;
		var vectorToPlayer = new Vector(playerX - x, playerY - y);
		playerDirection = vectorToPlayer.normalize();
		
		var playerAngle = playerDirection.toAngle();
		var turretAngle = facingVector.toAngle();
		
		var turretDotPlayer = facingVector.dot(playerDirection);
		var turretCrossPlayer = facingVector.cross(playerDirection);
		var signedAngleBetween = Math.atan2(turretCrossPlayer, turretDotPlayer);
		//math.atan2(cross/dot)
		
		if (Math.abs(signedAngleBetween) * 180 / Math.PI < rotationSpeed) {
			facingVector = playerDirection;
			if (!targetInFront) {
				playerFirstSeenTick = tickCount;
			}
			aimedAtTarget = true;
			targetInFront = true;
		} else {
			aimedAtTarget = false;
			if (Math.abs(signedAngleBetween) < (45 * Math.PI / 180)) {
				if (!targetInFront) {
				playerFirstSeenTick = tickCount;
				}
				targetInFront = true;
			} else {
				targetInFront = false;
			}
			var angleChange = 0;
			if (signedAngleBetween > 0) {
				angleChange = rotationSpeed;
			} else if (signedAngleBetween < 0) {
				angleChange = -1 * rotationSpeed;
			}
			
			var newTurretAngle = turretAngle + (angleChange * Math.PI / 180);
			
			var newFacingVector = new Vector(Math.cos(newTurretAngle), Math.sin(newTurretAngle));
			
			facingVector = newFacingVector.normalize();
		}
		
		if (targetInFront) {
			if (tickCount - playerFirstSeenTick > firingDelay) {
				if (currentShotsFiredInBurstCount < burstLength) {
					if (tickCount - lastShotFiredTick > delayBetweenShots) {
						lastShotFiredTick = tickCount;
						currentShotsFiredInBurstCount += 1;
						projectiles.push(new Projectile(x+(Math.random()*4)-2,y+(Math.random()*4)-2,facingVector));
					}
				} else {
					currentShotsFiredInBurstCount = 0;
					playerFirstSeenTick = tickCount;
				}
			}
		}
	}

	//draws turret on canvas context passed to it
	var draw = function(ctx) {
		ctx.save();
		ctx.translate(x,y);
		
		var angle = facingVector.toAngle();
		ctx.rotate(angle);
		
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(2 * radius, 0);
		ctx.lineTo(-1 * radius, -1 * radius);
		ctx.lineTo(-1 * radius, radius);
		ctx.fill();
		
		ctx.restore();
	};
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		getFacingVector: getFacingVector,
		getVectorToPlayer: getVectorToPlayer,
		setX: setX,
		setY: setY,
		setFacingVector: setFacingVector,
		setVectorToPlayer: setVectorToPlayer,
		update: update,
		draw: draw
	};
};
