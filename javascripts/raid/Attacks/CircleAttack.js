//CircleAttack class
class CircleAttack {
	constructor(startX, startY, color) {
		this.x = startX || 0;
		this.y = startY || 0;
		this.color = color || "pink";
		this.alpha = 1;
		this.radius = 50;
		this.tickCount = 0;
		this.delay = 50;
		this.duration = 50;

		this.finished = false;
	}

	isFinished() {
		return this.finished;
	}

	//update CircleAttack position
	update() {
		if (this.tickCount > this.delay + this.duration) {
			this.finished = true;
		}

		this.tickCount++;
	}

	//draws CircleAttack on canvas context passed to it
	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		if (this.tickCount <= this.delay) {
			ctx.strokeStyle = this.color;
			ctx.globalAlpha = Math.min(1, Math.max(0.5, (this.tickCount / this.delay)));
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
			ctx.stroke();

			ctx.fillStyle = this.color;
			ctx.globalAlpha = 0.6 * Math.max(0.2, (this.tickCount / this.delay));
			ctx.beginPath();
			ctx.arc(0, 0, this.radius * (this.tickCount / this.delay), 0, 2 * Math.PI, true);
			ctx.fill();

		} else {
			ctx.fillStyle = this.color;
			ctx.globalAlpha = 0.8;
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
			ctx.fill();
		}


		ctx.restore();
	}
}
