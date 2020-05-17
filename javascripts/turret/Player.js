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

	//return value of radius
	getRadius() {
		return this.radius;
	}

	getHitboxRadius() {
		return this.radius * this.hitboxRadiusPercent;
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
	update(targetX, targetY, ctx) {
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
	}

	//draws player on canvas context passed to it
	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();
	}
}
