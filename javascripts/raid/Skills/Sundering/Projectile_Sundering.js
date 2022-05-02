//Projectile_Sundering class
class Projectile_Sundering extends Projectile {
	constructor(startX, startY, startFacingVector) {
		super(startX, startY, startFacingVector);
		this.damage = 400000;
		this.color = "peru";
	}

	extraExplodeEffects(effects) {
		var extraExplodeRing = new PlayerProjectileImpactEffect(this, this.color);
		effects.push(extraExplodeRing);
	}
}
