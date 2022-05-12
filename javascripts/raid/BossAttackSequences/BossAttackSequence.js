//BossAttackSequence class

//the goal for this class is to contain the entire boss encounter's series
//of attack patterns and trigger them at the appropriate times
class BossAttackSequence {
	constructor() {
		this.timeElapsed = 0;
		this.difficulty = "medium";
		this.lastCase = -1;
		this.activeAttackPatterns = [];
	}

	//update BossAttackSequence
	update(dt, player, boss, ctx) {
		var loopDuration = 60;
		var loopNumber = Math.floor((this.timeElapsed - (this.timeElapsed % loopDuration)) / loopDuration) + 1;

		var newAttackPattern;
		var nextCase = Math.floor(this.timeElapsed);

		if (nextCase > this.lastCase) {
			this.lastCase = nextCase;
			if (loopNumber > 4) {
				//ENRAGE
				switch (nextCase - (4 * loopDuration)) {
					case 0:
						boss.phase = 0;
						boss.speed = 50;
						boss.targetDestination.setCoords(ctx.canvas.width / 2, ctx.canvas.height / 2);
						break;
					case 5: //countdown timer is for 3.5 min, which lines up with this attack starting
						newAttackPattern = new Pattern_BossTargetedCircle(this.difficulty);
						newAttackPattern.attackDelay = 10;
						newAttackPattern.attackDuration = 200;
						newAttackPattern.circlesRadii = 375;
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 10:
						newAttackPattern = new Pattern_Massacre(this.difficulty);
						newAttackPattern.duration = 200;
						this.activeAttackPatterns.push(newAttackPattern);
						break;
				}
				//end ENRAGE
			} else {
				var randomDirectionPersistent = 1;
				switch (nextCase % loopDuration) {
					case 0:
						boss.phase = 0;
						boss.speed = 50;
						boss.targetDestination.setCoords(ctx.canvas.width / 2, ctx.canvas.height / 2);
						randomDirectionPersistent = Math.sign(Math.random() - 0.5);
						if (randomDirectionPersistent == 0) {
							randomDirectionPersistent = 1;
						}
						break;
					case 2:
						if (loopNumber == 2 || loopNumber == 4) {
							//circle stays out for entire loop duration
							newAttackPattern = new Pattern_BossTargetedCircle(this.difficulty);
							this.activeAttackPatterns.push(newAttackPattern);

							var halfWidth = ctx.canvas.width / 2;
							var halfHeight = ctx.canvas.height / 2;

							if (this.difficulty == "medium" || this.difficulty == "hard") {
								var randomDirection = Math.sign(Math.random() - 0.5);
								if (randomDirection == 0) {
									randomDirection = 1;
								}

								newAttackPattern = new Pattern_TargetedDotCircle(halfWidth - (halfWidth / 2), halfHeight + (randomDirection * halfHeight / 2), this.difficulty);
								this.activeAttackPatterns.push(newAttackPattern);

								newAttackPattern = new Pattern_TargetedDotCircle(halfWidth + (halfWidth / 2), halfHeight - (randomDirection * halfHeight / 2), this.difficulty);
								this.activeAttackPatterns.push(newAttackPattern);
							}

							if (this.difficulty == "hard") {
								newAttackPattern = new Pattern_TargetedDotCircle(halfWidth, 0, this.difficulty);
								this.activeAttackPatterns.push(newAttackPattern);

								newAttackPattern = new Pattern_TargetedDotCircle(halfWidth, ctx.canvas.height, this.difficulty);
								this.activeAttackPatterns.push(newAttackPattern);
							}
						}
						break;
					case 3:
						boss.phase = 1;
						boss.speed = 80;
						var randomDirection = Math.sign(Math.random() - 0.5);
						if (randomDirection == 0) {
							randomDirection = 1;
						}
						boss.targetDestination.setCoords(ctx.canvas.width / 2, (ctx.canvas.height / 2) + randomDirection * 150);
						break;
					case 7:
						if (loopNumber == 3 || loopNumber == 4) {
							var loopAttack = new Pattern_PlayerTargetedCircles(this.difficulty);
							this.activeAttackPatterns.push(loopAttack);
						}
						break;
					case 8:
						newAttackPattern = new Pattern_BossToPlayerRectangles(this.difficulty);
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 11:
						newAttackPattern = new Pattern_BossToPlayerRectangles(this.difficulty);
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 14:
						newAttackPattern = new Pattern_BossToPlayerRectangles(this.difficulty);
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 18:
						boss.phase = 2;
						boss.speed = 150;
						boss.targetDestination.setCoords(ctx.canvas.width / 2 + (randomDirectionPersistent * ctx.canvas.width / 4), ctx.canvas.height / 2);
						break;
					case 20:
						if (loopNumber == 3 || loopNumber == 4) {
							var loopAttack = new Pattern_PlayerTargetedCircles(this.difficulty);
							this.activeAttackPatterns.push(loopAttack);
						}
						break;
					case 21:
						boss.speed = (ctx.canvas.width / 2) / 5;
						boss.targetDestination.setCoords(ctx.canvas.width / 2 - (randomDirectionPersistent * ctx.canvas.width / 4), ctx.canvas.height / 2);
						newAttackPattern = new Pattern_SynchronizedMassacre(this.difficulty);
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 29:
						boss.speed = 2000;
						boss.targetDestination.setCoords(ctx.canvas.width / 2 + (randomDirectionPersistent * ctx.canvas.width / 4), ctx.canvas.height / 2);
						break;
					case 33:
						boss.phase = 3;
						boss.speed = 300;
						boss.targetDestination.setCoords(ctx.canvas.width / 2, ctx.canvas.height / 2);
						break;
					case 36:
						newAttackPattern = new Pattern_BossToPlayerRectangles(this.difficulty);
						newAttackPattern.duration = 0;
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 39:
						newAttackPattern = new Pattern_BossToPlayerRectangles(this.difficulty);
						newAttackPattern.duration = 0;
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 42:
						newAttackPattern = new Pattern_BossToPlayerRectangles(this.difficulty);
						newAttackPattern.duration = 0;
						this.activeAttackPatterns.push(newAttackPattern);

						newAttackPattern = new Pattern_Massacre(this.difficulty);
						newAttackPattern.duration = 2;
						this.activeAttackPatterns.push(newAttackPattern);
						break;
					case 49:
						if (loopNumber == 3 || loopNumber == 4) {
							var loopAttack = new Pattern_PlayerTargetedCircles(this.difficulty);
							this.activeAttackPatterns.push(loopAttack);
						}
						break;
					case 50:
						newAttackPattern = new Pattern_Massacre(this.difficulty);
						this.activeAttackPatterns.push(newAttackPattern);
						break;
				}
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
