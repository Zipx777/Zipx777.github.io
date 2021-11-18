//Skill_FlameShock class
class Skill_FlameShock extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Flame Shock";
		this.cooldown = 360;
		this.range = 300;
		this.shock = true;

		this.projectile = Projectile_FlameShock;
	}
}
