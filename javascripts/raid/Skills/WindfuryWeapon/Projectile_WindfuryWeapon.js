//Projectile_WindfuryWeapon class
class Projectile_WindfuryWeapon extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 5;
		this.color = "blue";
		this.radius = 3;
		this.speed = 5;
	}
}
