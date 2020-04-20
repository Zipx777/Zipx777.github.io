//Turret class
var Turret_Homing = function(startX, startY, startRadius, startRotationSpeed, startFacingVector) {
	var x = startX,
		y = startY,
		color = "black", //main color
		currentColor = color, //color currently being rendered
		prefireColor = "purple",
		radius = startRadius || 12,
		rotationSpeed = startRotationSpeed || 2,
		facingVector = startFacingVector || new Vector(1,0),
		targetInFrontAngle = 60,
		delayBetweenShots = 10,
		burstLength = 1,
		currentShotsFiredInBurstCount = 0,
		firingDelay = 100,
		tickCount = 0,
		lastShotFiredTick = 0,
		playerFirstSeenTick = 0,
		targetInFront = false,
		firingAngleError = 2;

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

	//update Turret rotation/facing/firing
	var update = function(playerX, playerY, projectiles) {
		tickCount += 1;
		var vectorToPlayer = new Vector(playerX - x, playerY - y);

		//avoid divide-by-zero error if player is directly on top of turret
		if (vectorToPlayer.length() > 0) {
			var vectorToPlayer = vectorToPlayer.normalize();
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
			if (!targetInFront) {
				playerFirstSeenTick = tickCount;
			}
			targetInFront = true;
		} else {
			if (Math.abs(signedAngleBetween) < (targetInFrontAngle * Math.PI / 180)) {
				if (!targetInFront) {
					playerFirstSeenTick = tickCount;
				}
				targetInFront = true;
			} else {
				targetInFront = false;
			}

			var angleChange = (signedAngleBetween / Math.abs(signedAngleBetween)) * rotationSpeed;

			var newTurretAngle = facingVector.toAngle() + (angleChange * Math.PI / 180);

			var newFacingVector = new Vector(Math.cos(newTurretAngle), Math.sin(newTurretAngle));

			facingVector = newFacingVector.normalize();
		}

		//##########################################
		//###########  UPDATE FIRING  ##############
		//##########################################

		//completes the entire burst after it starts, even if player moves out of turret's front
		if (targetInFront || (currentShotsFiredInBurstCount > 0 && currentShotsFiredInBurstCount < burstLength)) {
			currentColor = prefireColor;
			if (tickCount - playerFirstSeenTick > firingDelay) {
				if (currentShotsFiredInBurstCount < burstLength) {
					if (tickCount - lastShotFiredTick > delayBetweenShots) {
						lastShotFiredTick = tickCount;
						currentShotsFiredInBurstCount += 1;

						//offset positions slightly to avoid visual weirdness from exact path follows
						var xSlightOffset = Math.random()*4-2;
						var ySlightOffset = Math.random()*4-2;

						var startingAngle = facingVector.toAngle();
						var newAngle = startingAngle + firingAngleError * Math.PI/180 * (Math.random()*2 - 1);

						var projVector = new Vector(0,0);
						projVector.setAngle(newAngle);
						projVector = projVector.normalize();
						projectiles.push(new Projectile_Homing(x + xSlightOffset,y + ySlightOffset, projVector));
					}
				} else {
					currentShotsFiredInBurstCount = 0;
					playerFirstSeenTick = tickCount;
				}
			}
		} else {
			currentColor = color;
			currentShotsFiredInBurstCount = 0;
		}
	}

	//draws turret on canvas context passed to it
	var draw = function(ctx) {
		ctx.save();

		//circle base
		ctx.translate(x,y);
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2 * Math.PI, true);
		ctx.fill();

		//triangle top
		var angle = facingVector.toAngle();
		ctx.rotate(angle);
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(2 * radius, 0);
		ctx.lineTo(-1 * radius, -1 * radius);
		ctx.lineTo(-1 * radius * 0.5, 0);
		ctx.lineTo(-1 * radius, radius);
		ctx.closePath();
		ctx.fill();

		//prefire gradient
		var grd = ctx.createLinearGradient(-0.5*radius, 0, radius, 0);
		grd.addColorStop(1, prefireColor);
		grd.addColorStop(0, color);
		//ctx.fillStyle = grd;
		ctx.fillStyle = prefireColor;

		var prefirePercent = 0;
		if (targetInFront || currentShotsFiredInBurstCount > 0) {
			var sinceFirstSeen = tickCount - playerFirstSeenTick;

			//controls when the color fades to prefire color. Added together needs to be less than 1
			var initialGapPercent = 0.6;
			var finalGapPercent = 0.2;

			prefirePercent = Math.max(0, ((sinceFirstSeen / firingDelay) - initialGapPercent) * (1/(1-initialGapPercent)));
			prefirePercent = Math.min(1, prefirePercent / (1 - initialGapPercent - finalGapPercent));
		}
		ctx.globalAlpha = prefirePercent;

		ctx.beginPath();
		ctx.moveTo(2 * radius, 0);
		ctx.lineTo(-1 * radius, -1 * radius);
		ctx.lineTo(-1 * radius * 0.5, 0);
		ctx.lineTo(-1 * radius, radius);
		ctx.closePath();
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
		update: update,
		draw: draw
	};
};
