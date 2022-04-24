//Pattern_TargetedDotCircle class

//spawns a circle centered on the boss
class Pattern_TargetedDotCircle extends AttackPattern {
	constructor(x,y,difficulty) {
		super(difficulty);
		this.attackColor = "purple";
		this.attackType = Attack_Circle;
		this.duration = 1;
		this.delayBetweenAttacks = 2;

		this.circlesRadii = 50;
		this.attackDelay = 3;
		this.attackDuration = 58;
		this.attackDamage = 50;

		this.x = x;
		this.y = y;
	}

	createAttack(player, boss, ctx) {
		var newAttack = new this.attackType(this.x, this.y, this.attackColor);
		newAttack.radius = this.circlesRadii;
		newAttack.damage = this.attackDamage;
		newAttack.delay = this.attackDelay;
		newAttack.duration = this.attackDuration;
		return newAttack;
	}
}
