//DamageText class
class DamageText {
	constructor(name, xStart, yStart, damageValue, damageColor) {
		this.name = name || "default_damage";
		this.value = damageValue || -1;
		this.color = damageColor || "pink";
		this.randomDirection = Math.random() - 0.5;
		this.x = xStart + 20*(this.randomDirection) || 0;
		this.y = yStart + 20*(this.randomDirection) || 0;
		this.duration = 60;
		this.tickCount = 0;
		this.finished = false;
		this.isSmall = false;

	}

	isFinished() {
		return this.finished;
	}

	update() {
		this.tickCount++;
		if (this.tickCount > this.duration) {
			this.finished = true;
		}
		var ySpeed = 0.8
		if (this.isSmall) {
			ySpeed = 0.3;
		}
		this.y -= ySpeed * (this.duration - this.tickCount) / this.duration;
		if (this.isSmall) {
			this.x += 0.2 * this.randomDirection / (Math.abs(this.randomDirection))
		}
	}

	draw(ctx) {
		ctx.save();
		ctx.font = '16px serif';
		ctx.textAlign = "center";
		if (this.isSmall) {
			ctx.font = '12px serif';
		} else {
			ctx.shadowColor="black";
			ctx.shadowBlur=1;
			ctx.lineWidth=3;
			ctx.strokeText(Math.floor(this.value), this.x, this.y);
			ctx.shadowBlur=0;
		}

		ctx.fillStyle = this.color;
  	ctx.fillText(Math.floor(this.value), this.x, this.y);
		ctx.restore();
	}
}
