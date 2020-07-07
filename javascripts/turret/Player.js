//Player class
class Player {
	constructor(startX, startY) {
		this.x = startX;
		this.y = startY;
		this.speed = 5;
		this.color = "blue";
		this.radius = 10;
		this.hitboxRadiusPercent = 0.5;

		this.explosionSFXFilePath = "sounds/turrets/playerDeath.wav";
		this.explosionSFXVolume = 1;

		this.controlMode = 1; //1 = mouse, 2 = wasd
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

	//update Player position
	update(targetX, targetY, keys, ctx) {
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
	}

	//draws player on canvas context passed to it
	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();
	}
}
