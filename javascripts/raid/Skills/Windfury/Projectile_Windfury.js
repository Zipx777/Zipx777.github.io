//Projectile_Windfury class
class Projectile_Windfury extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 5;
		this.color = "blue";
		this.radius = 3;
		this.speed = 5;
	}
}
