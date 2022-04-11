//Pattern_BossTargetedCircle class

//spawns a circle centered on the boss
class Pattern_BossTargetedCircle extends AttackPattern {
	constructor() {
		super();
		this.attackColor = "purple";
		this.attackType = Attack_Circle;
		this.duration = 1;
		this.delayBetweenAttacks = 2;
		this.circlesRadii = 75;
		this.attackDelay = 3;
		this.attackDuration = 45;
		this.attackDamage = 50;
	}

	createAttack(player, boss, ctx) {
		var newAttack = new this.attackType(boss.x, boss.y, this.attackColor);
		newAttack.radius = this.circlesRadii;
		newAttack.damage = this.attackDamage;
		newAttack.delay = this.attackDelay;
		newAttack.duration = this.attackDuration;
		return newAttack;
	}
}
