//Pattern_Massacre class

//spawns a series of random rectangles throughout the arena
class Pattern_Massacre extends AttackPattern {
	constructor() {
		super();
		this.attackColor = "pink";
		this.attackType = Attack_Rectangle;
		this.duration = 5;
		this.delayBetweenAttacks = 0.2;
		this.attackDelay = 1;
		this.attackDuration = 0.3;
	}

	createAttack(player, boss, ctx) {
		var newX = Math.random() * (ctx.canvas.width - 50) + 25;
		var newY = Math.random() * (ctx.canvas.height - 50) + 25;
		var newWidth = 2000;
		var newHeight = 50;
		var newAngle = Math.random() * Math.PI;
		var newAttack = new Attack_Rectangle(newX, newY, newWidth, newHeight, newAngle);
		newAttack.delay = this.attackDelay;
		newAttack.duration = this.attackDuration;
		return newAttack;
	}
}
