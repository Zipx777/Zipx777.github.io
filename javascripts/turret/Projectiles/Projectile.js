//Projectile class
class Projectile {
	constructor(startX, startY, startFacingVector) {
		this.x = startX || 0;
		this.y = startY || 0;
		this.speed = 2;
		this.color = "red";
		this.radius = 4;
		this.hitboxRadiusPercent = 1;
		this.facingVector = startFacingVector || new Vector(1,0);
		this.inBounds = true;
		//homing-specific variables, 0 maxRotationSpeed for no homing
		this.maxRotationSpeed = 0;
		this.currentRotationSpeed = 0;
		this.rotationAcceleration = 0.00;
		this.targetInFrontAngle = 0;

		this.doomed = false;
		this.doomedStart = 0;
		this.doomedDuration = 0;

		this.explosionSFXFilePath = "";
		this.explosionSFXVolume = 0;

		this.alive = true;
	}
	//return value of x
	getX() {
		return this.x;
	}

	//return value of y
	getY() {
		return this.y;
	}

	getRadius() {
		return this.radius;
	}

	getHitboxRadius() {
			return this.radius * this.hitboxRadiusPercent;
	}

	getColor() {
		return this.color;
	}

	//return speed value
	getSpeed() {
		return this.speed;
	}

	//return facingVector
	getFacingVector() {
		return this.facingVector;
	}

	//set new value for x
	setX(newX) {
		this.x = newX;
	}

	//set new value for y
	setY(newY) {
		this.y = newY;
	}

	//set speed value
	setSpeed(newSpeed) {
		this.speed = newSpeed;
	}

	//set facingVector
	setFacingVector(newFacingVector) {
		this.facingVector = newFacingVector;
	}

	isInBounds() {
		return this.inBounds;
	}

	isAlive() {
		return this.alive;
	}

	//update projectile position
	update() {
		var playerX = player.getX();
		var playerY = player.getY();

		var vectorToPlayer = new Vector(playerX - this.x, playerY - this.y);

		var projDotPlayer = this.facingVector.dot(vectorToPlayer);
		var projCrossPlayer = this.facingVector.cross(vectorToPlayer);
		var signedAngleBetween = Math.atan2(projCrossPlayer, projDotPlayer);

		//##########################################
		//###########  UPDATE FACING  ##############
		//##########################################

		if (Math.abs(signedAngleBetween) < (this.targetInFrontAngle * Math.PI / 180)) {
			if (Math.abs(signedAngleBetween) * 180 / Math.PI < Math.abs(this.currentRotationSpeed)) {
				//snap to target if aim is less than <rotationSpeed> away to avoid flickering
				//this.facingVector = vectorToPlayer;
			}
			this.targetInFront = true;
		} else {
			this.targetInFront = false;
		}

		if (this.targetInFront) {
			this.currentRotationSpeed *= 0.95;
			if (signedAngleBetween < 0) {
				this.currentRotationSpeed -= this.rotationAcceleration;
				this.currentRotationSpeed = Math.max(this.maxRotationSpeed * -1, this.currentRotationSpeed);
			} else {
				this.currentRotationSpeed += this.rotationAcceleration;
				this.currentRotationSpeed = Math.min(this.maxRotationSpeed, this.currentRotationSpeed);
			}
		} else {
			this.currentRotationSpeed *= 0.97;
		}

		var newTurretAngle = this.facingVector.toAngle() + (this.currentRotationSpeed * Math.PI / 180);

		var newFacingVector = new Vector(Math.cos(newTurretAngle), Math.sin(newTurretAngle));

		this.facingVector = newFacingVector.normalize();

		//##########################################
		//##########  UPDATE POSITION  #############
		//##########################################

		var velocity = this.facingVector.normalize().multiply(this.speed);

		this.x = this.x + velocity.getX();
		this.y = this.y + velocity.getY();

		if (this.x < 0 || this.x > ctx.canvas.width || this.y < 0 || this.y > ctx.canvas.height) {
			this.inBounds = false;
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
		var projExplosion = new Effect(this.getX(), this.getY());
		projExplosion.setColor(this.getColor());
		projExplosion.setRadius(this.getRadius());
		effects.push(projExplosion);

		if (this.explosionSFXVolume > 0) {
			var expSFX = new Audio(this.explosionSFXFilePath);
			expSFX.volume = this.explosionSFXVolume;
			expSFX.play();
		}

		this.alive = false;
	}

	//draws projectile on canvas context passed to it
	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		var angle = this.facingVector.toAngle();
		ctx.rotate(angle);

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(2 * this.radius, 0);
		ctx.lineTo(-1 * this.radius, -1 * this.radius);
		//ctx.lineTo(-0.5 * radius, 0);
		ctx.lineTo(-1 * this.radius, this.radius)
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}
}
