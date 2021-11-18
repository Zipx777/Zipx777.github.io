//Projectile_FlameShock class
class Projectile_FlameShock extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 20;
		this.color = "red";
		this.statusToApply = Status_FlameShock;
	}
}
