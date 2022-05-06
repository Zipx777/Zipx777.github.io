//Projectile_FrostShock class
class Projectile_FrostShock extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 125;
		this.color = "aqua";

		this.impactSoundFilePath = "javascripts/raid/Skills/FrostShock/frostShockImpact.wav";
	}
}
