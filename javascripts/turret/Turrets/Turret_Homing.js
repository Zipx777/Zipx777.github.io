//Turret_Homing class
class Turret_Homing extends Turret {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);

		this.color = "purple";
		this.radius = 12;
		this.projectileType = Projectile_Homing;
		this.targetInFrontAngle = 60;
		this.delayBetweenShots = 10;
		this.burstLength = 1;
		this.firingDelay = 100;
		this.startPrefireGapPercent = 0.6;

		this.maxRotationSpeed = 2;
		this.currentRotationSpeed = 0;
		this.rotationAcceleration = 0.2;
		this.rotationDecceleration = 0.5;
		this.canRotateWhileFiring = true;

		this.firingSFX = new Audio("sounds/turrets/deepPluck.wav");
		this.firingSFXVolume = 0.2;
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

		//prefire gradient
		//var grd = ctx.createLinearGradient(-0.5*radius, 0, radius, 0);
		//grd.addColorStop(1, prefireColor);
		//grd.addColorStop(0, color);
		//ctx.fillStyle = grd;

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
