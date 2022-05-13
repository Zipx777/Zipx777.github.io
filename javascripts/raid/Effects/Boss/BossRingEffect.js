//BossRingEffect class
class BossRingEffect extends RingEffect {
	constructor(boss, color) {
		super(boss.getX(), boss.getY(), color);
		this.setRadius((boss.getRadius() * 0.8) || 30);
		this.maxRadiusPercent = 1;
		this.maxRadiusMagnitude = 2.5;
		this.duration = 1;
		this.fadeOut = true;
		this.followTarget = boss;
	}

	updatePosition() {
		this.x = this.followTarget.x;
		this.y = this.followTarget.y;
	}
}
