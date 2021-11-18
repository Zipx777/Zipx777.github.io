//Skill_CrashLightning class
class Skill_CrashLightning extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Crash Lightning";
		this.cooldown = 540;
		this.range = 100;
		this.isMelee = true;

		this.projectile = Projectile_CrashLightning;
	}
}
