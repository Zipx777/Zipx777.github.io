//Skill_LavaLash class
class Skill_LavaLash extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Lava Lash";
		this.cooldown = 720;
		this.range = 100;
		this.isMelee = true;

		this.projectile = Projectile_LavaLash;
	}
}
