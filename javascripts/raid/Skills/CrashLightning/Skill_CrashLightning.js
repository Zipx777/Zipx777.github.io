//Skill_CrashLightning class
class Skill_CrashLightning extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Crash Lightning";
		this.baseCooldown = 540;
		this.cooldown = 540;
		this.range = 100;
		this.isMelee = true;

		this.projectile = Projectile_CrashLightning;
	}

	extraUpdateLogic(player) {
		this.cooldown = this.baseCooldown * player.hasteMultiplier;
		this.cooldownTracker = Math.min(this.cooldownTracker, this.cooldown);
	}
}
