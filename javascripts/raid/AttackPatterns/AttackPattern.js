//AttackPattern class
class AttackPattern {
	constructor() {
		this.timeElapsed = 0;
		this.duration = 2;
		this.delayBetweenAttacks = 1;
		this.timeSinceLastAttack = 0;
		this.attackType = Attack_Circle;
		this.numAttacks = 1;
		this.attackColor = "pink";
		this.circlesRadii = 50;
		this.attackDelay = 1;
		this.attackDuration = 1;

		this.activeAttacks = [];
		this.finished = false;
	}

	isFinished() {
		return this.finished;
	}

	//returns vector with x and y position for the attack
	createAttack(player, boss, ctx) {
		var newAttack = new this.attackType(newAttackLocation.getX(), newAttackLocation.getY(), this.attackColor);
		newAttack.radius = this.circlesRadii;
		newAttack.delay = this.attackDelay;
		newAttack.duration = this.attackDuration;
		return newAttack;
	}

	//update AttackPattern
	update(dt, player, boss, ctx) {
		if ((this.timeElapsed > this.duration) && this.activeAttacks.length == 0) {
			this.finished = true;
		} else {
			if (this.timeElapsed <= this.duration) {
				if (this.timeSinceLastAttack >= this.delayBetweenAttacks) {
					this.timeSinceLastAttack = this.timeSinceLastAttack % this.delayBetweenAttacks;
					for (var i = 0; i < this.numAttacks; i++) {
						var newAttack = this.createAttack(player, boss, ctx);
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

	//draws AttackPattern on canvas context passed to it
	draw(ctx) {
		//draw earlier attacks on top of newer ones, the earlier ones are the ones that are (usually) closer to exploding
		//also when the attack goes off, the going-off effect can get drowned out by newer attack windups without this
		for (var i = this.activeAttacks.length - 1; i >= 0; i--) {
			this.activeAttacks[i].draw(ctx);
		}
	}
}
