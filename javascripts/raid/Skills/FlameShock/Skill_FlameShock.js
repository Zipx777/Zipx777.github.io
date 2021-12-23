//Skill_FlameShock class
class Skill_FlameShock extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Flame Shock";
		this.backgroundImageFilePath = "javascripts/raid/Skills/FlameShock/icon_flameShock.jpg";
		this.cooldown = 6;
		this.range = 300;
		this.shock = true;

		this.projectile = Projectile_FlameShock;
	}
}
