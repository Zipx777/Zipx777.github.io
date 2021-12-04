//Effect class
class Effect {
	constructor(startX, startY, color) {
		this.x = startX || 0;
		this.y = startY || 0;
		this.color = color || "pink";
		this.radius = 5;
		this.hitboxRadiusPercent = 1;
		this.startRadius = this.radius;
		this.maxRadiusPercent = 0.2;
		this.maxRadiusMagnitude = 1.5;
		this.timeElapsed = 0;
		this.duration = 0.3;
		this.doesDamage = false;

		this.turretToSpawn = null;

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

	getHitboxRadius() {
		return this.radius * this.hitboxRadiusPercent;
	}

	getDoesDamage() {
		return this.doesDamage;
	}

	getTurretToSpawn() {
		return this.turretToSpawn;
	}

	//set new value for x
	setX(newX) {
		this.x = newX;
	}

	//set new value for y
	setY(newY) {
		this.y = newY;
	}

	setColor(newColor) {
		this.color = newColor;
	}

	setRadius(newRadius) {
		this.radius = newRadius;
		this.startRadius = newRadius;
	}

	setDuration(newDuration) {
		this.duration = newDuration;
	}

	setDoesDamage(newDoesDamage) {
		this.doesDamage = newDoesDamage;
	}

	setTurretToSpawn(turret) {
		this.turretToSpawn = turret;
	}

	isAlive() {
		return this.alive;
	}

	//update projectile position
	update(dt) {
		this.timeElapsed += dt;
		if (this.timeElapsed >= this.duration) {
			this.alive = false;
		}

		var newRadius = this.radius;
		if (this.timeElapsed/this.duration < this.maxRadiusPercent) {
			newRadius = (this.maxRadiusMagnitude - 1) * this.startRadius * (this.timeElapsed / (this.maxRadiusPercent * this.duration)) + this.startRadius;
		} else {
			var mTerm = -1 * this.maxRadiusMagnitude * this.startRadius / ((1 - this.maxRadiusPercent) * this.duration);
			var bTerm = this.maxRadiusMagnitude * this.startRadius / (1 - this.maxRadiusPercent);
			newRadius = mTerm * this.timeElapsed + bTerm;
		}
		this.radius = newRadius;
	}

	//draws projectile on canvas context passed to it
	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		ctx.fillStyle = this.color;

		ctx.beginPath();
		ctx.arc(0, 0, Math.max(0, this.radius), 0, 2 * Math.PI, true);
		ctx.fill();

		ctx.restore();
	}
}
