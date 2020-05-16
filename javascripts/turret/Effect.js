//Effect class
class Effect {
	constructor(startX, startY, color, startFacingVector) {
		this.x = startX || 0;
		this.y = startY || 0;
		this.color = color || "pink";
		this.radius = 5;
		this.hitboxRadiusPercent = 1;
		this.startRadius = this.radius;
		this.maxRadiusPercent = 0.2;
		this.maxRadiusMagnitude = 1.5;
		this.facingVector = startFacingVector || new Vector(1,0);
		this.tickCount = 0;
		this.duration = 20;
		this.finished = false;
		this.doesDamage = false;
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

	//return facingVector
	getFacingVector() {
		return this.facingVector;
	}

	//return finished
	getFinished() {
		return this.finished;
	}

	getDoesDamage() {
		return this.doesDamage;
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

	//set facingVector
	setFacingVector(newFacingVector) {
		this.facingVector = newFacingVector;
	}

	setDoesDamage(newDoesDamage) {
		this.doesDamage = newDoesDamage;
	}

	//update projectile position
	update() {
		this.tickCount++;
		if (this.tickCount >= this.duration) {
			this.finished = true;
		}

		var newRadius = this.radius;
		if (this.tickCount/this.duration < this.maxRadiusPercent) {
			newRadius = (this.maxRadiusMagnitude - 1) * this.startRadius * (this.tickCount / (this.maxRadiusPercent * this.duration)) + this.startRadius;
		} else {
			var mTerm = -1 * this.maxRadiusMagnitude * this.startRadius / ((1 - this.maxRadiusPercent) * this.duration);
			var bTerm = this.maxRadiusMagnitude * this.startRadius / (1 - this.maxRadiusPercent);
			newRadius = mTerm * this.tickCount + bTerm;
		}
		this.radius = newRadius;
	}

	//draws projectile on canvas context passed to it
	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		ctx.fillStyle = this.color;
		//ctx.globalAlpha = (this.duration - this.tickCount) / (this.duration * (1 - this.maxRadiusPercent));
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();

		ctx.restore();
	}
}
