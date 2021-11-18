//Turret_Sniper class
class Turret_Sniper extends Turret {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);

		this.color = "orange";
		this.projectileType = Projectile_Sniper;
		this.burstLength = 1;

		this.maxRotationSpeed = 10;
		this.rotationAcceleration = 0.1;
		this.rotationDecceleration = 0.5;
	}

	//draws turret on canvas context passed to it
	draw(ctx) {
		ctx.save();

		//circle base
		ctx.translate(this.x,this.y);
		ctx.fillStyle = this.baseColor;
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();

		//triangle top
		var angle = this.facingVector.toAngle();
		ctx.rotate(angle);
		ctx.fillStyle = this.baseColor;
		ctx.beginPath();
		ctx.moveTo(2 * this.radius, 0);
		ctx.lineTo(-1 * this.radius, -1.1 * this.radius);
		ctx.lineTo(-1 * this.radius * 0.5, 0);
		ctx.lineTo(-1 * this.radius, 1.1 * this.radius);
		ctx.closePath();
		ctx.fill();

		//pre-fire light up
		ctx.fillStyle = this.color;
		ctx.globalAlpha = this.prefireColorPercent;
		ctx.beginPath();
		ctx.moveTo(2 * this.radius, 0);
		ctx.lineTo(-1 * this.radius, -1.1 * this.radius);
		ctx.lineTo(-1 * this.radius * 0.5, 0);
		ctx.lineTo(-1 * this.radius, 1.1 * this.radius);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	};
};
