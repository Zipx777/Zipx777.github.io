//RingEffect class
class RingEffect extends Effect {
	constructor(startX, startY, color) {
		super(startX, startY, color);
		this.ringWidth = 5;
	}

	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		//stroke instead of fill
		ctx.strokeStyle = this.color;

		if (this.fadeOut) {
			ctx.globalAlpha = Math.max(1 - (this.timeElapsed / this.duration), 0);
		}
		ctx.beginPath();
		ctx.lineWidth = this.ringWidth;
		ctx.arc(0, 0, Math.max(0, this.radius), 0, 2 * Math.PI, true);
		ctx.stroke();

		ctx.restore();
	}
}
