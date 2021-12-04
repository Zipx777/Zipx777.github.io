//Attack_Circle class
class Attack_Circle {
	constructor(startX, startY, color) {
		this.name = "Circle Attack";
		this.x = startX || 0;
		this.y = startY || 0;
		this.color = color || "pink";
		this.alpha = 1;
		this.radius = 50;
		this.timeElapsed = 0;
		this.delay = 1;
		this.duration = 1;
		this.damage = 60;

		this.finished = false;
	}

	isFinished() {
		return this.finished;
	}

	extraUpdateLogic(dt, player, boss, ctx) {

	}

	//update CircleAttack position
	update(dt, player, boss, ctx) {
		this.extraUpdateLogic(dt, player, boss, ctx);

		var distBetweenSquared = Math.pow(player.getX() - this.x, 2) + Math.pow(player.getY() - this.y, 2);
		if (this.timeElapsed > this.delay) {
			if (distBetweenSquared < Math.pow(this.radius, 2)) {
				player.takeDamage(this.damage * dt);
			}
		}

		if (this.timeElapsed > this.delay + this.duration) {
			this.finished = true;
		}

		this.timeElapsed += dt;
	}

	//draws CircleAttack on canvas context passed to it
	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		if (this.timeElapsed <= this.delay) {
			ctx.strokeStyle = this.color;
			ctx.globalAlpha = Math.min(1, Math.max(0.5, (this.timeElapsed / this.delay)));
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
			ctx.stroke();

			ctx.fillStyle = this.color;
			ctx.globalAlpha = 0.6 * Math.max(0.2, (this.timeElapsed / this.delay));
			ctx.beginPath();
			ctx.arc(0, 0, this.radius * (this.timeElapsed / this.delay), 0, 2 * Math.PI, true);
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
