//Pattern_MovingCircleSpray class

//spawns a series of moving circles emanating from the boss
class Pattern_MovingCircleSpray extends AttackPattern {
	constructor() {
		super();
		this.attackColor = "grey";
		this.attackType = Attack_MovingCircle;
		this.duration = 600;
		this.delayBetween = 60;
		this.attackDuration = 2000;
		this.attackSpeed = 0.8;
	}

	extraAttackSpawnLogic(newAttack, player, boss, ctx) {
		var randomVector = new Vector(Math.random() - 0.5, Math.random() - 0.5);
		newAttack.direction = randomVector;
		newAttack.bounceOffWalls = true;
		newAttack.speed = this.attackSpeed;
	}

	calculateAttackLocation(player, boss, ctx) {
		var attackLocation = new Vector(boss.x, boss.y);
		return attackLocation;
	}
}
