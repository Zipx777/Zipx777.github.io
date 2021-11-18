//Projectile_StormStrike class
class Projectile_StormStrike extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 200;
		this.color = "orange";
	}
}
