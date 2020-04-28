//Projectile class
class Projectile_Homing extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);

		this.speed = 3;
		this.color = "purple";
		this.radius = 5;
		//homing-specific variables
		this.maxRotationSpeed = 3;
		this.currentRotationSpeed = 0;
		this.rotationAcceleration = 0.3;
		this.targetInFrontAngle = 60;
	}

	//draws projectile on canvas context passed to it
	draw(ctx) {
		ctx.save();
		ctx.translate(this.x,this.y);

		var angle = this.facingVector.toAngle();
		ctx.rotate(angle);

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(2 * this.radius, 0);
		ctx.lineTo(-1 * this.radius, -1 * this.radius);
		ctx.lineTo(-0.5 * this.radius, 0);
		ctx.lineTo(-1 * this.radius, this.radius)
		ctx.fill();

		ctx.restore();
	}
}
