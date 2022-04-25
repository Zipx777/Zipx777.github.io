//Projectile_AutoAttack class
class Projectile_AutoAttack extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 30;
		this.color = "blue";
		this.radius = 3;
		this.ascendanceBuff = false;
	}

	extraExplodeEffects(effects) {
		if (this.ascendanceBuff) {
			var buffedExplodeRing = new PlayerProjectileImpactEffect(this, this.color);
			effects.push(buffedExplodeRing);
		}
	}
}
