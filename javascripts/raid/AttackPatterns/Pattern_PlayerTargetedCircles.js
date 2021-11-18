//SeriesOfPlayerTargetedCircles class

//spawns a series of circles targeted on the player's location
class Pattern_PlayerTargetedCircles extends AttackPattern {
	constructor() {
		super();
	}

	//returns vector with x and y position for the attack
	calculateAttackLocation(targetX, targetY, ctx) {
		var attackLocation = new Vector(targetX, targetY);
		return attackLocation;
	}
}
