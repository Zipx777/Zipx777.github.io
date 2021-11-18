//Skill_FrostShock class
class Skill_FrostShock extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Frost Shock";
		this.cooldown = 360;
		this.range = 300;
		this.shock = true;

		this.projectile = Projectile_FrostShock;
	}
}
