//Pattern_RandomCircles class

//spawns a series of random circles throughout the arena
class Pattern_RandomCircles extends AttackPattern {
	constructor() {
		super();
		this.attackColor = "purple";
		this.duration = 150;
		this.delayBetween = 20;
		this.circlesRadii = 75;
		this.attackDelay = 200;
		this.attackDuration = 150;
	}

	calculateAttackLocation(player, boss, ctx) {
		var borderMargin = 10;
		var randX = Math.random() * (ctx.canvas.width - 2*borderMargin) + borderMargin;
		var randY = Math.random() * (ctx.canvas.height - 2*borderMargin) + borderMargin;
		var attackLocation = new Vector(randX, randY);
		return attackLocation;
	}
}
