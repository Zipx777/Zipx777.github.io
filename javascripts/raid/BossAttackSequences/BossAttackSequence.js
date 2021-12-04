//BossAttackSequence class

//the goal for this class is to contain the entire boss encounter's series
//of attack patterns and trigger them at the appropriate times
class BossAttackSequence {
	constructor() {
		this.timeElapsed = 0;
		this.lastCase = 0;
		this.activeAttackPatterns = [];
	}

	//update BossAttackSequence
	update(dt, player, boss, ctx) {
		var loopNumber = Math.floor((this.timeElapsed - (this.timeElapsed % 120)) / 120);

		var newAttackPattern;
		var nextCase = Math.floor((this.timeElapsed) % 120);
		if (nextCase > this.lastCase) {
			this.lastCase = nextCase;
			switch (nextCase) {
				case 0:
					boss.phase = 0;
					break;
				case 3:
					boss.phase = 1;
					break;
				case 5:
					newAttackPattern = new Pattern_RandomCircles(player, boss, ctx);
					newAttackPattern.delayBetween = Math.max(newAttackPattern.delayBetween - (loopNumber * 0.05), 0.1);
					this.activeAttackPatterns.push(newAttackPattern);
					break;
				case 15:
					boss.phase = 0;
					break;
				case 18:
					boss.phase = 2;
					break;
				case 20:
					newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
					newAttackPattern.circlesRadii += (loopNumber * 10);
					this.activeAttackPatterns.push(newAttackPattern);
					break;
				case 30:
					boss.phase = 0;
					break;
				case 33:
					boss.phase = 3;
					break;
				case 35:
					newAttackPattern = new Pattern_MovingCircleSpray(player, boss, ctx);
					newAttackPattern.attackSpeed += (loopNumber * 10);
					this.activeAttackPatterns.push(newAttackPattern);
					break;
				case 60:
					boss.phase = 0;
					break;
				case 63:
					boss.phase = 4;
					break;
				case 65:
					newAttackPattern = new Pattern_RandomCircles(player, boss, ctx);
					newAttackPattern.delayBetween = Math.max(newAttackPattern.delayBetween - (loopNumber * 5), 0);
					this.activeAttackPatterns.push(newAttackPattern);
					newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
					newAttackPattern.circlesRadii += (loopNumber * 10);
					this.activeAttackPatterns.push(newAttackPattern);
					break;
				case 80:
					boss.phase = 0;
					break;
				case 83:
					boss.phase = 5;
					break;
				case 85:
					newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
					newAttackPattern.circlesRadii += (loopNumber * 10);
					this.activeAttackPatterns.push(newAttackPattern);
					newAttackPattern = new Pattern_MovingCircleSpray(player, boss, ctx);
					newAttackPattern.attackSpeed += (loopNumber * 0.2);
					this.activeAttackPatterns.push(newAttackPattern);
					break;
				case 100:
					boss.phase = 0;
					break;
				case 103:
					boss.phase = 6;
					break;
				case 105:
					newAttackPattern = new Pattern_RandomCircles(player, boss, ctx);
					newAttackPattern.delayBetween = Math.max(newAttackPattern.delayBetween - (loopNumber * 5), 0);
					this.activeAttackPatterns.push(newAttackPattern);
					newAttackPattern = new Pattern_PlayerTargetedCircles(player, boss, ctx);
					newAttackPattern.circlesRadii += (loopNumber * 10);
					this.activeAttackPatterns.push(newAttackPattern);
					newAttackPattern = new Pattern_MovingCircleSpray(player, boss, ctx);
					newAttackPattern.attackSpeed += (loopNumber * 0.2);
					this.activeAttackPatterns.push(newAttackPattern);
					break;
				}
		}

		var tempActiveAttackPatterns = [];
		$.each(this.activeAttackPatterns, function(i,activeAttackPattern) {
			if (!activeAttackPattern.isFinished()) {
				activeAttackPattern.update(dt, player, boss, ctx);
				tempActiveAttackPatterns.push(activeAttackPattern);
			}
		});
		this.activeAttackPatterns = tempActiveAttackPatterns;

		this.timeElapsed += dt;
	}

	//draws BossAttackSequence on canvas context passed to it
	draw(ctx) {
		$.each(this.activeAttackPatterns, function(i, activeAttackPattern) {
			activeAttackPattern.draw(ctx);
		});
	}
}
