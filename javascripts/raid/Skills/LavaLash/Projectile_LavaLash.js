//Projectile_LavaLash class
class Projectile_LavaLash extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 150;
		this.color = "red";

		this.impactSoundFilePath = "javascripts/raid/Skills/LavaLash/lavaLashImpact.wav";
		this.impactSoundVolume = 0.8;
	}
}
