//PlayerSkillActivatedEffect class
class PlayerSkillActivatedEffect extends RingEffect {
	constructor(player, color) {
		super(player.getX(), player.getY(), color);
		this.setRadius(player.getRadius() || 30);
		this.maxRadiusPercent = 1;
		this.maxRadiusMagnitude = 10;
		this.duration = 0.5;
		this.fadeOut = true;
	}
}
