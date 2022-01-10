//SeriesOfPlayerTargetedCircles class

//spawns a series of circles targeted on the player's location
class Pattern_PlayerTargetedCircles extends AttackPattern {
	constructor() {
		super();
		this.duration = 7;
		this.delayBetweenAttacks = 0.5;
		this.circlesRadii = 40;
		this.attackDelay = 2.5;
		this.attackDuration = 3.5;
		this.attackColor = "crimson";
	}

	createAttack(player, boss, ctx) {
		var borderMargin = 10;
		var newAttack = new this.attackType(player.getX(), player.getY(), this.attackColor);
		newAttack.delay = this.attackDelay;
		newAttack.duration = this.attackDuration;
		return newAttack;
	}
}
