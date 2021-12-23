//Skill_FrostShock class
class Skill_FrostShock extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Frost Shock";
		this.backgroundImageFilePath = "javascripts/raid/Skills/FrostShock/icon_frostShock.jpg";
		this.cooldown = 6;
		this.range = 300;
		this.shock = true;

		this.projectile = Projectile_FrostShock;
	}
}
