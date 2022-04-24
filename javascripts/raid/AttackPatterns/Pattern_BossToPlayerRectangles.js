//Pattern_BossToPlayerRectangles class

//spawns a series of rectangles extending from the boss at the player
class Pattern_BossToPlayerRectangles extends AttackPattern {
	constructor(difficulty) {
		super(difficulty);
		this.attackColor = "pink";
		this.attackType = Attack_Rectangle;

		if (this.difficulty == "easy") {
			this.duration = 1.3;
		} else if (this.difficulty == "medium") {
			this.duration = 1.6;
		} else if (this.difficulty == "hard") {
			this.duration = 1.9;
		}

		if (this.difficulty == "easy") {
			this.delayBetweenAttacks = 0.4;
		} else if (this.difficulty == "medium") {
			this.delayBetweenAttacks = 0.3;
		} else if (this.difficulty == "hard") {
			this.delayBetweenAttacks = 0.2;
		}

		if (this.difficulty == "easy") {
			this.attackDelay = 1.5;
		} else if (this.difficulty == "medium") {
			this.attackDelay = 1.2;
		} else if (this.difficulty == "hard") {
			this.attackDelay = 1;
		}

		this.attackDuration = 0.3;
	}

	createAttack(player, boss, ctx) {
		var newX = boss.x;
		var newY = boss.y;
		var newWidth = 2000;
		var newHeight = 50;
		var newAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
		var newAttack = new this.attackType(newX, newY, newWidth, newHeight, newAngle);
		newAttack.delay = this.attackDelay;
		newAttack.duration = this.attackDuration;
		return newAttack;
	}
}
