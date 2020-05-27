//Turret class
class Turret {
	constructor(startX, startY, startFacingVector) {
		this.x = startX;
		this.y = startY;
		this.baseColor = "black"; //main color
		this.currentColor = this.baseColor; //color currently being rendered
		this.color = "red"; //color used for pre-fire
		
		this.projectileType = Projectile;
		this.radius = 12;
		this.hitboxRadiusPercent = 1;

		//rotation
		this.maxRotationSpeed = 1;
		this.currentRotationSpeed = 0;
		this.rotationAcceleration = 0.01;
		this.rotationDecceleration = 0.05;
		this.canRotateWhilePrefiring = true;
		this.canRotateWhileFiring = false;

		//facing
		this.targetInFrontAngle = 60;
		this.facingVector = startFacingVector || new Vector(2*Math.random() - 1, 2*Math.random() - 1);

		//firing
		this.delayBetweenShots = 10;
		this.burstLength = 5;
		this.currentShotsFiredInBurstCount = 0;
		this.projectilesPerShot = 1;
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
		this.projectileMaxInitialXOffset = 0; //bound for offset perpindicular to firing angle
		this.projectileMaxInitialYOffset = 0;

		this.doomed = false;
		this.doomedStart = 0;
		this.doomedDuration = 8;

		this.firingSFX = new Audio("sounds/turrets/snare.mp3");
		this.firingSFXVolume = 0.1;
		this.tickLastFiringSoundEvent = 0;
		this.ticksBetweenFiringSoundEvents = 10;

		this.explosionSFX = new Audio("sounds/turrets/turretExplosion.mp3");
		this.explosionSFXVolume = 0.4;

		this.alive = true;
	}

	//return value of x
	getX() {
		return this.x;
	};

	//return value of y
	getY() {
		return this.y;
	};

	getColor() {
		return this.color;
	}

	getRadius() {
		return this.radius;
	};

	getHitboxRadius() {
		return this.radius * this.hitboxRadiusPercent;
	}

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

	isAlive() {
		return this.alive;
	}

	fireProjectile(projectiles) {
		var turretAngle = this.facingVector.toAngle();
		var newAngle = turretAngle + this.firingAngleError * Math.PI/180 * (Math.random()*2 - 1);

		//shift projectile to the end of the barrel
		var turretBarrelMarker = this.facingVector.normalize().multiply(this.radius);

		var horizontalOffsetVector = new Vector(0,0);
		if (this.projectileMaxInitialXOffset > 0) {
			var coinFlip = 2*Math.random() - 1;
			if (coinFlip > 0) {
				horizontalOffsetVector.setX(turretBarrelMarker.getY());
				horizontalOffsetVector.setY(-1 * turretBarrelMarker.getX());
			} else {
				horizontalOffsetVector.setX(-1 * turretBarrelMarker.getY());
				horizontalOffsetVector.setY(turretBarrelMarker.getX());
			}
			var xScalar = this.projectileMaxInitialXOffset * Math.random();
			if (xScalar == 0) {
				sScalar = 1;
			}
			horizontalOffsetVector = horizontalOffsetVector.normalize().multiply(xScalar);
		}

		var verticalOffsetVector = new Vector(0,0);
		if (this.projectileMaxInitialYOffset > 0) {
			verticalOffsetVector.setX(turretBarrelMarker.getX());
			verticalOffsetVector.setY(turretBarrelMarker.getY());

			var yScalar = this.projectileMaxInitialYOffset * Math.random();
			if (yScalar == 0) {
				yScalar = 1;
			}
			verticalOffsetVector = verticalOffsetVector.normalize().multiply(yScalar);
		}

		var projX = this.x + turretBarrelMarker.getX() + horizontalOffsetVector.getX() + verticalOffsetVector.getX();
		var projY = this.y + turretBarrelMarker.getY() + horizontalOffsetVector.getY() + verticalOffsetVector.getY();

		var projVector = new Vector(0,0);
		projVector.setAngle(newAngle);
		projVector = projVector.normalize();

		projectiles.push(new this.projectileType(projX, projY, projVector));
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

		if (this.canRotateWhilePrefiring || this.prefireColorPercent <= 0 || this.currentShotsFiredInBurstCount > 0) {
			if (this.canRotateWhileFiring || this.currentShotsFiredInBurstCount <= 0) {
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
			} else {
				this.currentRotationSpeed = 0;
			}
		} else {
			this.currentRotationSpeed = 0; //not including this result in flicks where acceleration builds up while turret is paused, could be cool as a feature
		}
		//##########################################
		//###########  UPDATE FIRING  ##############
		//##########################################

		//completes the entire burst after it starts, even if player moves out of turret's front
		if (this.prefireColorPercent > 0 || (this.currentShotsFiredInBurstCount > 0 && this.currentShotsFiredInBurstCount < this.burstLength)) {
			this.currentColor = this.color;
			if (this.tickCount - this.playerFirstSeenTick > this.firingDelay) {
				if (this.currentShotsFiredInBurstCount < this.burstLength) {
					if (this.tickCount - this.lastShotFiredTick > this.delayBetweenShots) {
						this.lastShotFiredTick = this.tickCount;
						this.currentShotsFiredInBurstCount += 1;

						for (var i = 0; i < this.projectilesPerShot; i++) {
							this.fireProjectile(projectiles);
							if (this.firingSFXVolume > 0 && this.tickCount >= this.tickLastFiringSoundEvent + this.ticksBetweenFiringSoundEvents) {
								//this.firingSFX = new Audio(this.firingSFXFilePath);
								this.firingSFX.pause();
								this.firingSFX.currentTime = 0.0;
								this.firingSFX.volume = this.firingSFXVolume;
								this.firingSFX.play();

								this.tickLastFiringSoundEvent = this.tickCount;
							}
						}
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

		if (this.alive && this.doomed) {
			if (this.tickCount > this.doomedStart + this.doomedDuration) {
					this.explode();
			}
		}
	}

	takeDamage() {
		if (!this.doomed) {
			this.doomed = true;
			this.doomedStart = this.tickCount;
		}
	}

	explode() {
		var turretExplosion = new Effect(this.getX(), this.getY());
		turretExplosion.setColor(this.getColor());
		turretExplosion.setRadius(this.getRadius());
		turretExplosion.setDuration(50);
		turretExplosion.setDoesDamage(true);
		effects.push(turretExplosion);

		if (this.explosionSFXVolume > 0) {
			this.explosionSFX.volume = this.explosionSFXVolume;
			this.explosionSFX.play();
		}

		this.alive = false;
	}

	//draws turret on canvas context passed to it
	draw(ctx) {
		ctx.save();

		//circle base
		ctx.translate(this.x,this.y);
		ctx.fillStyle = this.baseColor;
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();

		//triangle top
		var angle = this.facingVector.toAngle();
		ctx.rotate(angle);
		ctx.fillStyle = this.baseColor;
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

		ctx.fillStyle = this.color;
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
