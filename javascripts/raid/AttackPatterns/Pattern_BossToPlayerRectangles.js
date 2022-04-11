//Pattern_BossToPlayerRectangles class

//spawns a series of rectangles extending from the boss at the player
class Pattern_BossToPlayerRectangles extends AttackPattern {
	constructor() {
		super();
		this.attackColor = "pink";
		this.attackType = Attack_Rectangle;
		this.duration = 1.6;
		this.delayBetweenAttacks = 0.2;
		this.attackDelay = 1.2;
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
