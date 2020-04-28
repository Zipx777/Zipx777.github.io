//Turret class
class Turret {
	constructor(startX, startY, startRadius, startRotationSpeed, startFacingVector) {
		this.x = startX;
		this.y = startY;
		this.color = "black"; //main color
		this.currentColor = this.color; //color currently being rendered
		this.prefireColor = "red";
		this.projectileType = Projectile;
		this.radius = startRadius || 12;

		this.maxRotationSpeed = startRotationSpeed || 1;
		this.currentRotationSpeed = 0;
		this.rotationAcceleration = 0.01;
		this.rotationDecceleration = 0.05;

		this.targetInFrontAngle = 60;

		this.facingVector = startFacingVector || new Vector(1,0);
		this.delayBetweenShots = 10;
		this.burstLength = 5;
		this.currentShotsFiredInBurstCount = 0;
		this.firingDelay = 100;
		this.prefireColorPercent = 0; //used to set gradient for prefire tell
		//controls when the color fades to prefire color in the firing delay. Added together needs to be less than 1
		this.startPrefireGapPercent = 0.4;
		this.endPrefireGapPercent = 0.2;
		this.tickCount = 0;
		this.lastShotFiredTick = 0;
		this.playerFirstSeenTick = 0;
		this.targetInFront = false,
		this.firingAngleError = 0;
	}

	//return value of x
	getX() {
		return this.x;
	};

	//return value of y
	getY() {
		return this.y;
	};

	getFacingVector() {
		return this.facingVector;
	}

	getVectorToPlayer() {
		return this.vectorToPlayer;
	}

	//set new value for x
	setX(newX) {
		this.x = newX;
	};

	//set new value for y
	setY(newY) {
		this.y = newY;
	};

	setFacingVector(newFacingVector) {
		this.facingVector = newFacingVector;
	}

	//update Turret rotation/facing/firing
	update(playerX, playerY, projectiles) {
		this.tickCount += 1;
		var vectorToPlayer = new Vector(playerX - this.x, playerY - this.y);

		//avoid divide-by-zero error if player is directly on top of turret
		if (vectorToPlayer.length() > 0) {
			var vectorToPlayer = vectorToPlayer.normalize();
		}

		var turretDotPlayer = this.facingVector.dot(vectorToPlayer);
		var turretCrossPlayer = this.facingVector.cross(vectorToPlayer);
		var signedAngleBetween = Math.atan2(turretCrossPlayer, turretDotPlayer);

		//##########################################
		//###########  UPDATE FACING  ##############
		//##########################################
		//this.currentRotationSpeed *= 0.9;
		//this seemed to kill the rotation speed too much
		if (signedAngleBetween < 0) {
			if (this.currentRotationSpeed > 0) { //decelerate faster to avoid wobbling
				this.currentRotationSpeed -= this.rotationDecceleration;
			} else {
				this.currentRotationSpeed -= this.rotationAcceleration;
			}
			this.currentRotationSpeed = Math.max(this.maxRotationSpeed * -1, this.currentRotationSpeed);
		} else {
			if (this.currentRotationSpeed < 0) { //decelerate faster to avoid wobbling
				this.currentRotationSpeed += this.rotationDecceleration;
			} else {
				this.currentRotationSpeed += this.rotationAcceleration;
			}
			this.currentRotationSpeed = Math.min(this.maxRotationSpeed, this.currentRotationSpeed);
		}
		if (Math.abs(signedAngleBetween) < (this.targetInFrontAngle * Math.PI / 180)) {
			if (Math.abs(signedAngleBetween) < (Math.abs(this.currentRotationSpeed)) * Math.PI / 180) {
				if (Math.abs(this.currentRotationSpeed) < this.rotationDecceleration) {
					//snap to target if aim is less than <rotationSpeed> away to avoid flickering
					this.facingVector = vectorToPlayer;
					this.currentRotationSpeed = 0;
				}
			}
			if (!this.targetInFront && this.prefireColorPercent == 0) {
				this.playerFirstSeenTick = this.tickCount;
			}
			this.targetInFront = true;
		} else {
			this.targetInFront = false;
		}



		var newTurretAngle = this.facingVector.toAngle() + (this.currentRotationSpeed * Math.PI / 180);

		var newFacingVector = new Vector(Math.cos(newTurretAngle), Math.sin(newTurretAngle));

		this.facingVector = newFacingVector.normalize();

		//##########################################
		//###########  UPDATE FIRING  ##############
		//##########################################

		//completes the entire burst after it starts, even if player moves out of turret's front
		if (this.prefireColorPercent > 0 || (this.currentShotsFiredInBurstCount > 0 && this.currentShotsFiredInBurstCount < this.burstLength)) {
			this.currentColor = this.prefireColor;
			if (this.tickCount - this.playerFirstSeenTick > this.firingDelay) {
				if (this.currentShotsFiredInBurstCount < this.burstLength) {
					if (this.tickCount - this.lastShotFiredTick > this.delayBetweenShots) {
						this.lastShotFiredTick = this.tickCount;
						this.currentShotsFiredInBurstCount += 1;

						var turretAngle = this.facingVector.toAngle();
						var newAngle = turretAngle + this.firingAngleError * Math.PI/180 * (Math.random()*2 - 1);

						//shift projectile to the end of the barrel
						var turretBarrelMarker = this.facingVector.normalize().multiply(this.radius);
						var projX = this.x + turretBarrelMarker.getX();
						var projY = this.y + turretBarrelMarker.getY();

						var projVector = new Vector(0,0);
						projVector.setAngle(newAngle);
						projVector = projVector.normalize();

						projectiles.push(new this.projectileType(projX, projY, projVector));
					}
				} else {
					this.currentShotsFiredInBurstCount = 0;
					this.playerFirstSeenTick = this.tickCount;
				}
			}
		} else {
			this.currentColor = this.color;
			this.currentShotsFiredInBurstCount = 0;
		}

		//update prefire color percent
		if (this.targetInFront || this.currentShotsFiredInBurstCount > 0 || this.prefireColorPercent > 0) {
			var sinceFirstSeen = this.tickCount - this.playerFirstSeenTick;

			this.prefireColorPercent = Math.max(0, ((sinceFirstSeen / this.firingDelay) - this.startPrefireGapPercent) * (1/(1-this.startPrefireGapPercent)));
			this.prefireColorPercent = Math.min(1, this.prefireColorPercent / (1 - this.startPrefireGapPercent - this.endPrefireGapPercent));
		}
	}

	//draws turret on canvas context passed to it
	draw(ctx) {
		ctx.save();

		//circle base
		ctx.translate(this.x,this.y);
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();

		//triangle top
		var angle = this.facingVector.toAngle();
		ctx.rotate(angle);
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(2 * this.radius, 0);
		ctx.lineTo(-1 * this.radius, -1 * this.radius);
		//ctx.lineTo(-1 * radius * 0.5, 0);
		ctx.lineTo(-1 * this.radius, this.radius);
		ctx.closePath();
		ctx.fill();

		//prefire gradient
		//var grd = ctx.createLinearGradient(-0.5*radius, 0, radius, 0);
		//grd.addColorStop(1, prefireColor);
		//grd.addColorStop(0, color);
		//ctx.fillStyle = grd;

		ctx.fillStyle = this.prefireColor;
		ctx.globalAlpha = this.prefireColorPercent;
		ctx.beginPath();
		ctx.moveTo(2 * this.radius, 0);
		ctx.lineTo(-1 * this.radius, -1 * this.radius);
		//ctx.lineTo(-1 * radius * 0.5, 0);
		ctx.lineTo(-1 * this.radius, this.radius);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}
}
