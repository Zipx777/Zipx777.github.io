//Projectile_LightningBolt class
class Projectile_LightningBolt extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 200;
		this.color = "orange";
		this.maxMaelstromStacksApplied = false;

		this.impactSoundFilePath = "javascripts/raid/Skills/LightningBolt/lightningBoltImpact.wav";
	}

	modifyDamage(maelstromStacks) {
		this.damage = this.damage * (1 + (0.2 * maelstromStacks));
		if (maelstromStacks == 5) {
			this.maxMaelstromStacksApplied = true;
		}
	}

	extraExplodeEffects(effects) {
		if (this.maxMaelstromStacksApplied) {
			var buffedExplodeRing = new PlayerProjectileImpactEffect(this, this.color);
			effects.push(buffedExplodeRing);
		}
	}
}
