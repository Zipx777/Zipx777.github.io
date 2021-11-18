//Projectile_LightningBolt class
class Projectile_LightningBolt extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 200;
		this.color = "orange";
	}

	modifyDamage(maelstromStacks) {
		this.damage = this.damage * (1 + (0.2 * maelstromStacks));
	}
}
