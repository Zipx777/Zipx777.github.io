//SeriesOfPlayerTargetedCircles class

//spawns a series of circles targeted on the player's location
class Pattern_PlayerTargetedCircles extends AttackPattern {
	constructor() {
		super();
		this.duration = 250;
		this.delayBetween = 30;
		this.circlesRadii = 40;
		this.attackDelay = 150;
		this.attackDuration = 200;
	}

	//returns vector with x and y position for the attack
	calculateAttackLocation(player, boss, ctx) {
		var attackLocation = new Vector(player.getX(), player.getY());
		return attackLocation;
	}
}
