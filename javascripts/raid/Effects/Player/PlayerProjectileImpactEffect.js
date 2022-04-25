//PlayerProjectileImpactEffect class
class PlayerProjectileImpactEffect extends RingEffect {
	constructor(proj, color) {
		super(proj.getX(), proj.getY(), color);
		this.setRadius(proj.getRadius()); 
		this.maxRadiusPercent = 1;
		this.maxRadiusMagnitude = 5;
		this.duration = 0.3;
		this.fadeOut = true;
	}
}
