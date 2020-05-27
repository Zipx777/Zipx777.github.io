//Turret_Railgun class
class Turret_Railgun extends Turret {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);

		this.radius = 15;

		this.prefireColor = "teal";
		this.color = this.prefireColor;
		this.projectileType = Projectile_Railgun;

		this.maxRotationSpeed = 1;
		this.rotationAcceleration = 0.05;
		this.rotationDecceleration = 0.1;

		this.targetInFrontAngle = 40;
		this.delayBetweenShots = 1;
		this.burstLength = 5;
		this.firingDelay = 200;
		this.startPrefireGapPercent = 0.4;
		this.projectilesPerShot = 5;
		this.firingAngleError = 10;
		this.projectileMaxInitialXOffset = 8;
		this.projectileMaxInitialYOffset = 5;

		this.canRotateWhilePrefiring = false;
		this.canRotateWhileFiring = false;
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

		var smallerRadius = this.radius * 0.8;
		var barrelLengthMultiplier = 1.5;
		var edgeMarginMultiplier = 0.7;

		//rotating top
		var angle = this.facingVector.toAngle();
		ctx.rotate(angle);
		ctx.fillStyle = this.baseColor;
		ctx.beginPath();
		ctx.moveTo(barrelLengthMultiplier * smallerRadius, smallerRadius);
		ctx.lineTo(barrelLengthMultiplier * smallerRadius, -1 * smallerRadius);
		ctx.lineTo(0, -1 * smallerRadius);
		ctx.lineTo(0, smallerRadius);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		ctx.save();
		//prefire color fade in
		ctx.translate(this.x, this.y);
		ctx.rotate(angle);
		ctx.fillStyle = this.prefireColor;
		ctx.globalAlpha = this.prefireColorPercent;
		ctx.beginPath();
		ctx.moveTo(barrelLengthMultiplier * smallerRadius, smallerRadius * edgeMarginMultiplier);
		ctx.lineTo(barrelLengthMultiplier * smallerRadius, -1 * smallerRadius * edgeMarginMultiplier);
		ctx.lineTo(0, -1 * smallerRadius * edgeMarginMultiplier);
		ctx.arc(0, 0, smallerRadius * edgeMarginMultiplier, Math.PI / 2, -3 * Math.PI / 2, true);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();

		ctx.closePath();
		ctx.fill();
		ctx.restore();
	};
};
