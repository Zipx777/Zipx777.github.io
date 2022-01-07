//Pattern_RandomRectangles class

//spawns a series of random rectangles throughout the arena
class Pattern_RandomRectangles extends AttackPattern {
	constructor() {
		super();
		this.attackColor = "pink";
		this.attackType = Attack_Rectangle;
		this.duration = 10000;
		this.delayBetweenAttacks = 0.2;
		this.attackDelay = 1;
		this.attackDuration = 0.3;
	}

	update(dt, player, boss, ctx) {
		if ((this.timeElapsed > this.duration) && this.activeAttacks.length == 0) {
			this.finished = true;
		} else {
			if (this.timeElapsed <= this.duration) {
				if (this.timeSinceLastAttack >= this.delayBetweenAttacks) {
					this.timeSinceLastAttack = this.timeSinceLastAttack % this.delayBetweenAttacks;
					for (var i = 0; i < this.numAttacks; i++) {
						var newAttackLocation = this.calculateAttackLocation(player, boss, ctx);
						var randX = Math.random() * (ctx.canvas.width - 50) + 25;
						var randY = Math.random() * (ctx.canvas.height - 50) + 25;
						var randAngle = Math.random() * Math.PI;
						var newAttack = new this.attackType(randX, randY, 2000, 50, randAngle);
						newAttack.delay = this.attackDelay;
						newAttack.duration = this.attackDuration;
						this.extraAttackSpawnLogic(newAttack, player, boss, ctx);
						this.activeAttacks.push(newAttack);
					}
				}
			}

			var tempActiveAttacks = [];
			$.each(this.activeAttacks, function(i,activeAttack) {
				if (!activeAttack.isFinished()) {
					activeAttack.update(dt, player, boss, ctx);
					tempActiveAttacks.push(activeAttack);
				}
			});
			this.activeAttacks = tempActiveAttacks;
		}

		this.timeElapsed += dt;
		this.timeSinceLastAttack += dt;
	}
}
