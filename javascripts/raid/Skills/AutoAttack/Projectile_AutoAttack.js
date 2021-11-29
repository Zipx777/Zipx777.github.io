//Projectile_AutoAttack class
class Projectile_AutoAttack extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 30;
		this.color = "blue";
		this.radius = 3;

		this.maxRotationSpeed = 100;
		this.rotationAcceleration = 0.1;
	}
}
