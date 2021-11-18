//Player class
class Player {
	constructor(startX, startY) {
		this.x = startX;
		this.y = startY;
		this.speed = 2;
		this.color = "blue";
		this.gcdColor = "white";
		this.castingColor = "aqua";
		this.radius = 10;
		this.hitboxRadiusPercent = 0.5;
		this.isMoving = false;

		this.maelstromStacks = 0;
		this.snapshotMaelstromStacks = 0; //how many stacks were there when lightning bolt started casting

		this.stormbringerBuff = false;

		this.explosionSFXFilePath = "sounds/turrets/playerDeath.wav";
		this.explosionSFXVolume = 1;

		this.controlMode = 2; //1 = mouse, 2 = wasd
	}

	//return value of x
	getX() {
		return this.x;
	}

	//return value of y
	getY() {
		return this.y;
	}

	//set new value for x
	setX(newX) {
		this.x = newX;
	}

	//set new value for y
	setY(newY) {
		this.y = newY;
	}

	setControlMode(mode) {
		this.controlMode = mode;
	}

	//return value of radius
	getRadius() {
		return this.radius;
	}

	getHitboxRadius() {
		return this.radius * this.hitboxRadiusPercent;
	}

	getControlMode() {
		return this.controlMode;
	}

	takeDamage() {
		this.color = "gray";

		if (this.explosionSFXVolume > 0) {
			var expSFX = new Audio(this.explosionSFXFilePath);
			expSFX.volume = this.explosionSFXVolume;
			expSFX.play();
		}
	}

	//update Player position and skills
	update(targetX, targetY, keys, ctx) {

		//save starting x,y to compare after, to check for movement
		var saveStartX = this.x;
		var saveStartY = this.y;

		//update movement
		if (this.controlMode == 1) {
			var vectorTowardsMouse = new Vector(targetX - this.x, targetY - this.y);
			if (vectorTowardsMouse.length() > this.speed) {
				vectorTowardsMouse = vectorTowardsMouse.normalize().multiply(this.speed);
			}

			this.x += vectorTowardsMouse.getX();
			this.y += vectorTowardsMouse.getY();

			//clamp position to within the canvas bounds
			this.x = Math.max(this.x, 0);
			this.y = Math.max(this.y, 0);
			this.x = Math.min(this.x, ctx.canvas.width);
			this.y = Math.min(this.y, ctx.canvas.height);
		} else if (this.controlMode == 2) {
			var movementVector = new Vector(0,0);
			if (keys.up) {
				movementVector.setY(movementVector.getY() - 1);
			}

			if (keys.down) {
				movementVector.setY(movementVector.getY() + 1);
			}

			if (keys.left) {
				movementVector.setX(movementVector.getX() - 1);
			}

			if (keys.right) {
				movementVector.setX(movementVector.getX() + 1);
			}

			if (movementVector.length() > 0) {
				movementVector = movementVector.normalize().multiply(this.speed);

				this.x += movementVector.getX();
				this.y += movementVector.getY();

				//stop player going out of bounds
				this.x = Math.max(0, this.x);
				this.x = Math.min(ctx.canvas.width, this.x);
				this.y = Math.max(0, this.y);
				this.y = Math.min(ctx.canvas.height, this.y);
			}
		}

		if (this.x == saveStartX && this.y == saveStartY) {
			this.isMoving = false;
		} else {
			this.isMoving = true;
		}
	}

	//draws player on canvas context passed to it
	draw(ctx, gcdCooldown, gcdTracker, skillCastTime, castingTime) {
		//player
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.restore();

		//gcd
		if (gcdTracker > 0) {
			ctx.save();
			/*
			//circle line sweep down clockwise
			ctx.strokeStyle = this.gcdColor;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 3, -1 * Math.PI/2, 2 * Math.PI * ((gcdCooldown - gcdTracker) / gcdCooldown) - Math.PI/2, true);
			ctx.stroke();
			*/

			//circle grow from center
			ctx.strokeStyle = this.gcdColor;
			ctx.globalAlpha = Math.min(1, Math.max(0, (gcdTracker / gcdCooldown)));
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius) * ((gcdCooldown - gcdTracker) / gcdCooldown), 0, 2 * Math.PI, true);
			ctx.stroke();
			ctx.restore();
		}

		//casting visual
		if (skillCastTime > 0) {
			ctx.save();
			ctx.fillStyle = this.castingColor;
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius - 1) * ((skillCastTime - castingTime) / skillCastTime), 0, 2 * Math.PI, true);
			ctx.fill();
			ctx.restore();
		}

		//maelstrom stacks visual
		ctx.save();
		ctx.fillStyle = "orange";

		//horizontal line
		/*
		for (var i = 0; i < this.maelstromStacks; i++) {
			ctx.beginPath();
			ctx.arc(this.x + 5 * (Math.ceil(i/2) * Math.pow(-1,i)), this.y - this.radius, 2, 0, 2 * Math.PI, true);
			ctx.fill();
		}
		*/

		//radial dots
		for (var i = 0; i < this.maelstromStacks; i++) {
			ctx.beginPath();
			var tempAngle = i * ((2*Math.PI) / this.maelstromStacks) - (Math.PI/2);
			ctx.arc(this.x + (this.radius - 1) * Math.cos(tempAngle), this.y + (this.radius - 1) * Math.sin(tempAngle), 2, 0, 2 * Math.PI, true);
			ctx.fill();
		}
		ctx.restore();
	}
}
