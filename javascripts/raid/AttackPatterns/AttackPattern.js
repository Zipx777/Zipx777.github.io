//AttackPattern class
class AttackPattern {
	constructor() {
		this.tickCount = 0;
		this.duration = 100;
		this.delayBetween = 10;
		this.attackType = CircleAttack;
		this.numAttacks = 1;
		this.attackColor = "red";
		this.circlesRadii = 50;
		this.attackDelay = 50;
		this.attackDuration = 50;

		this.activeAttacks = [];
		this.finished = false;
	}

	isFinished() {
		return this.finished;
	}

	//returns vector with x and y position for the attack
	calculateAttackLocation(targetX, targetY, ctx) {
		var attackLocation = new Vector(0.5 * ctx.canvas.width, 0.5 * ctx.canvas.height);
		return attackLocation;
	}

	//update AttackPattern
	update(targetX, targetY, ctx) {
		if (this.tickCount > this.duration && this.activeAttacks.length == 0) {
			this.finished = true;
		} else {
			if (this.tickCount <= this.duration) {
				if (tickCount % this.delayBetween == 0) {
					for (var i = 0; i < this.numAttacks; i++) {
						var newAttackLocation = this.calculateAttackLocation(targetX, targetY, ctx);
						var newAttack = new this.attackType(newAttackLocation.getX(), newAttackLocation.getY(), this.attackColor);
						newAttack.radius = this.circlesRadii;
						newAttack.delay = this.attackDelay;
						newAttack.duration = this.attackDuration;
						this.activeAttacks.push(newAttack);
					}
				}
			}

			var tempActiveAttacks = [];
			$.each(this.activeAttacks, function(i,activeAttack) {
				if (!activeAttack.isFinished()) {
					activeAttack.update();
					tempActiveAttacks.push(activeAttack);
				}
			});
			this.activeAttacks = tempActiveAttacks;
		}

		this.tickCount++;
	}

	//draws AttackPattern on canvas context passed to it
	draw(ctx) {
		$.each(this.activeAttacks, function (i, activeAttack) {
			activeAttack.draw(ctx);
		});
	}
}
