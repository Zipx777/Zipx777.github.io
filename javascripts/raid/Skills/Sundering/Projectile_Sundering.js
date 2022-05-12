//Projectile_Sundering class
class Projectile_Sundering extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 400;
		this.color = "peru";
		this.impactSoundFilePath = "javascripts/raid/Skills/Sundering/sunderingImpact.wav";
	}

	extraExplodeEffects(effects) {
		var extraExplodeRing = new PlayerProjectileImpactEffect(this, this.color);
		effects.push(extraExplodeRing);
	}
}
