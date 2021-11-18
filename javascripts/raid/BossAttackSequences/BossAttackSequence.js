//BossAttackSequence class

//the goal for this class is to contain the entire boss encounter's series
//of attack patterns and trigger them at the appropriate times
class BossAttackSequence {
	constructor() {
		this.openingDelay = 100;
		this.tickCount = 0;
		this.activeAttackPatterns = [];
	}

	//update BossAttackSequence
	update(targetX, targetY, ctx) {
		if ((this.tickCount - this.openingDelay) % 400 == 0) {
			var newAttackPattern = new Pattern_PlayerTargetedCircles(targetX, targetY, ctx);
			newAttackPattern.duration = 250;
			newAttackPattern.delayBetween = 30;
			newAttackPattern.circlesRadii = 40;
			newAttackPattern.attackDelay = 150;
			newAttackPattern.attackDuration = 200;

			var newAttackPattern2 = new Pattern_RandomCircles(targetX, targetY, ctx);
			newAttackPattern2.duration = 150;
			newAttackPattern2.delayBetween = 20;
			newAttackPattern2.circlesRadii = 75;
			newAttackPattern2.attackDelay = 200;
			newAttackPattern2.attackDuration = 150;

			this.activeAttackPatterns.push(newAttackPattern);
			this.activeAttackPatterns.push(newAttackPattern2);
		}

		var tempActiveAttackPatterns = [];
		$.each(this.activeAttackPatterns, function(i,activeAttackPattern) {
			if (!activeAttackPattern.isFinished()) {
				activeAttackPattern.update(targetX, targetY, ctx);
				tempActiveAttackPatterns.push(activeAttackPattern);
			}
		});
		this.activeAttackPatterns = tempActiveAttackPatterns;

		this.tickCount++;
	}

	//draws BossAttackSequence on canvas context passed to it
	draw(ctx) {
		$.each(this.activeAttackPatterns, function(i, activeAttackPattern) {
			activeAttackPattern.draw(ctx);
		});
	}
}
