//Projectile class
class Projectile {
	constructor(startX, startY, startFacingVector) {
		this.x = startX || 0;
		this.y = startY || 0;
		this.damage = 0;
		this.statusToApply = null;

		this.speed = 3;
		this.color = "pink";
		this.radius = 6;
		this.hitboxRadiusPercent = 1;
		this.facingVector = startFacingVector || new Vector(1,0);
		this.inBounds = true;

		this.isMelee = false;
		this.skillOrigin = null;

		//homing-specific variables, 0 maxRotationSpeed for no homing
		this.maxRotationSpeed = 5;
		this.currentRotationSpeed = 0;
		this.rotationAcceleration = 0.3;
		this.targetInFrontAngle = 180;

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

	//have to do this instead of directly referencing stored variable to avoid an error
	getNewStatusToApply() {
		return new this.statusToApply();
	}

	isInBounds() {
		return this.inBounds;
	}

	isAlive() {
		return this.alive;
	}

	//used for things like Maelstrom stacks for Lightning Bolt
	modifyDamage(modifier) {

	}

	//update projectile position
	update(target) {
		var targetX = target.getX();
		var targetY = target.getY();

		var vectorToTarget = new Vector(targetX - this.x, targetY - this.y);

		var projDotTarget = this.facingVector.dot(vectorToTarget);
		var projCrossTarget = this.facingVector.cross(vectorToTarget);
		var signedAngleBetween = Math.atan2(projCrossTarget, projDotTarget);

		//##########################################
		//###########  UPDATE FACING  ##############
		//##########################################

		if (Math.abs(signedAngleBetween) < (this.targetInFrontAngle * Math.PI / 180)) {
			if (Math.abs(signedAngleBetween) * 180 / Math.PI < Math.abs(this.currentRotationSpeed)) {
				//snap to target if aim is less than <rotationSpeed> away to avoid flickering
				//this.facingVector = vectorToTarget;
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

	explode(effects) {
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
		ctx.lineTo(-0.4 * this.radius, 0.6 * this.radius);
		ctx.lineTo(-0.8 * this.radius, 0.6 * this.radius * 0.5);
		ctx.lineTo(-0.8 * this.radius, -0.6 * this.radius * 0.5);
		ctx.lineTo(-0.4 * this.radius, -0.6 * this.radius);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}
}
