//Projectile_FrostShock class
class Projectile_FrostShock extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 100;
		this.color = "aqua";
	}
}
