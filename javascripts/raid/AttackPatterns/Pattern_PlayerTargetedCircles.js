//SeriesOfPlayerTargetedCircles class

//spawns a series of circles targeted on the player's location
class Pattern_PlayerTargetedCircles extends AttackPattern {
	constructor() {
		super();
		this.duration = 4;
		this.delayBetweenAttacks = 0.5;
		this.circlesRadii = 40;
		this.attackDelay = 2.5;
		this.attackDuration = 3.5;
		this.attackColor = "crimson";
	}

	//returns vector with x and y position for the attack
	calculateAttackLocation(player, boss, ctx) {
		var attackLocation = new Vector(player.getX(), player.getY());
		return attackLocation;
	}
}
