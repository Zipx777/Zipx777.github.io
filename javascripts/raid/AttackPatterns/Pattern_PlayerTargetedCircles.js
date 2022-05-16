//SeriesOfPlayerTargetedCircles class

//spawns a series of circles targeted on the player's location
class Pattern_PlayerTargetedCircles extends AttackPattern {
	constructor(difficulty) {
		super(difficulty);

		if (this.difficulty == "easy") {
			this.duration = 6;
		} else if (this.difficulty == "medium") {
			this.duration = 6.5;
		} else if (this.difficulty == "hard") {
			this.duration = 7;
		}

		if (this.difficulty == "easy") {
			this.delayBetweenAttacks = 1;
		} else if (this.difficulty == "medium") {
			this.delayBetweenAttacks = 0.75;
		} else if (this.difficulty == "hard") {
			this.delayBetweenAttacks = 0.5;
		}


		if (this.difficulty == "easy") {
			this.circlesRadii = 35;
		} else if (this.difficulty == "medium") {
			this.circlesRadii = 40;
		} else if (this.difficulty == "hard") {
			this.circlesRadii = 45;
		}

		if (this.difficulty == "easy") {
			this.attackDelay = 3;
		} else if (this.difficulty == "medium") {
			this.attackDelay = 2.5;
		} else if (this.difficulty == "hard") {
			this.attackDelay = 2;
		}

		if (this.difficulty == "easy") {
			this.attackDuration = 2.5;
		} else if (this.difficulty == "medium") {
			this.attackDuration = 3;
		} else if (this.difficulty == "hard") {
			this.attackDuration = 3.5;
		}

		this.attackColor = "crimson";
	}

	createAttack(player, boss, ctx) {
		var newAttack = new this.attackType(player.getX(), player.getY(), this.attackColor);
		newAttack.delay = this.attackDelay;
		newAttack.duration = this.attackDuration;
		newAttack.radius = this.circlesRadii;
		newAttack.attackSoundVolume = 0.15;
		return newAttack;
	}
}
