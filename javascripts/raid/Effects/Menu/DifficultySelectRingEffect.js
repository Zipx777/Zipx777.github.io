//RingEffect class
class DifficultySelectRingEffect extends RingEffect {
	constructor(startX, startY, color, newRadius) {
		super(startX, startY, color);
		this.setRadius(newRadius || 30);
		this.maxRadiusPercent = 1;
		this.maxRadiusMagnitude = 2;
		this.duration = 0.3;
		this.fadeOut = true;
	}
}
