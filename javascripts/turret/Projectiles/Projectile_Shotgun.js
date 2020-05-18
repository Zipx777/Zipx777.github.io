//Projectile_Shotgun class
class Projectile_Shotgun extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);

		this.speed = 6;
		this.color = "orange";
		this.radius = 2.5;
	}

	//draws projectile on canvas context passed to it
	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		var angle = this.facingVector.toAngle();
		ctx.rotate(angle);

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.radius, this.radius);
		ctx.lineTo(this.radius, -1 * this.radius);
		ctx.lineTo(-1 * this.radius, -1 * this.radius);
		ctx.lineTo(-1 * this.radius, this.radius);
		ctx.closePath();
		ctx.fill();

		ctx.restore();
	}
}
