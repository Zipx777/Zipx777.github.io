//Projectile_CrashLightning class
class Projectile_CrashLightning extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 50;
		this.color = "orange";

		this.impactSoundFilePath = "javascripts/raid/Skills/CrashLightning/crashLightningImpact.wav";
	}
}
