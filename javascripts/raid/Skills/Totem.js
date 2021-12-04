//Totem class
class Totem {
	constructor(startX, startY) {
		this.x = startX || 0;
		this.y = startY || 0;


		this.color = "pink";
		this.radius = 6;
		this.range = 100;

		this.skillOrigin = null;
		this.statusToApply = null;

		this.duration = 100;
		this.timeElapsed = 0;

		this.alive = true;
	}

	isAlive() {
		return this.alive;
	}

	inRangeOf(target) {
		var xDiff = target.x - this.x;
		var yDiff = target.y - this.y;
		var distBetween = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
		return distBetween <= this.range;
	}

	update(dt, player) {
		if (this.timeElapsed >= this.duration) {
			this.alive = false;
		}

		if (this.statusToApply) {
			var statusFound = null;
			for (var i = 0; i < player.statuses.length; i++) {
				if (player.statuses[i].name == this.statusToApply.name) {
					statusFound = player.statuses[i];
				}
			}
			if (!statusFound && this.inRangeOf(player)) {
				player.statuses.push(new this.statusToApply);
			} else if (statusFound && !this.inRangeOf(player)) {
				player.removeStatus(this.statusToApply.name)
			}
		}
		this.timeElapsed += dt;
	}

	//draws totem
	draw(ctx) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();

		ctx.lineWidth = 1;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI, true);
		ctx.stroke();
		ctx.restore();
	}
}
