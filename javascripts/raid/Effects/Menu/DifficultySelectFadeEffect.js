//RingEffect class
class DifficultySelectFadeEffect extends Effect {
	constructor(startX, startY, color, newRadius) {
		super(startX, startY, color);
		this.setRadius(newRadius || 30);
		this.duration = 0.1;
		this.maxRadiusPercent = 0;
		this.maxRadiusMagnitude = 1;
	}
}
