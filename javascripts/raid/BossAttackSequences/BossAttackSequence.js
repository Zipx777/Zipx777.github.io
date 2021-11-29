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
	update(player, boss, ctx) {
		var loopNumber = (((this.tickCount/60) - (this.tickCount/60) % 120) / 120);
		var newAttackPattern;
		switch ((this.tickCount / 60) % 120) {
			case 5:
				newAttackPattern = new Pattern_RandomCircles(player, boss, ctx);
				newAttackPattern.delayBetween = Math.max(newAttackPattern.delayBetween - (loopNumber * 5), 0);
				this.activeAttackPatterns.push(newAttackPattern);
				break;
			case 20:
				newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
				newAttackPattern.circlesRadii += (loopNumber * 10);
				this.activeAttackPatterns.push(newAttackPattern);
				break;
			case 35:
				newAttackPattern = new Pattern_MovingCircleSpray(player, boss, ctx);
				newAttackPattern.attackSpeed += (loopNumber * 0.2);
				this.activeAttackPatterns.push(newAttackPattern);
				break;
			case 65:
				newAttackPattern = new Pattern_RandomCircles(player, boss, ctx);
				newAttackPattern.delayBetween = Math.max(newAttackPattern.delayBetween - (loopNumber * 5), 0);
				this.activeAttackPatterns.push(newAttackPattern);
				newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
				newAttackPattern.circlesRadii += (loopNumber * 10);
				this.activeAttackPatterns.push(newAttackPattern);
				break;
			case 85:
				newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
				newAttackPattern.circlesRadii += (loopNumber * 10);
				this.activeAttackPatterns.push(newAttackPattern);
				newAttackPattern = new Pattern_MovingCircleSpray(player, boss, ctx);
				newAttackPattern.attackSpeed += (loopNumber * 0.5);
				this.activeAttackPatterns.push(newAttackPattern);
				break;
			case 105:
				newAttackPattern = new Pattern_RandomCircles(player, boss, ctx);
				newAttackPattern.delayBetween = Math.max(newAttackPattern.delayBetween - (loopNumber * 5), 0);
				this.activeAttackPatterns.push(newAttackPattern);
				newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
				newAttackPattern.circlesRadii += (loopNumber * 10);
				this.activeAttackPatterns.push(newAttackPattern);
				newAttackPattern = new Pattern_MovingCircleSpray(player, boss, ctx);
				newAttackPattern.attackSpeed += (loopNumber * 0.5);
				this.activeAttackPatterns.push(newAttackPattern);
				break;
		}

		var tempActiveAttackPatterns = [];
		$.each(this.activeAttackPatterns, function(i,activeAttackPattern) {
			if (!activeAttackPattern.isFinished()) {
				activeAttackPattern.update(player, boss, ctx);
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
