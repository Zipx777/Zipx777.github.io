//Projectile_StormStrike class
class Projectile_StormStrike extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 130;
		this.stormbringerBuff = false;
		this.color = "orange";
		this.impactSoundFilePath = "javascripts/raid/Skills/StormStrike/stormStrikeImpact.wav";
		this.impactSoundVolume = 0.3;
	}

	extraExplodeEffects(effects) {
		if (this.stormbringerBuff) {
			var buffedExplodeRing = new PlayerProjectileImpactEffect(this, this.color);
			effects.push(buffedExplodeRing);
		}
	}
}
