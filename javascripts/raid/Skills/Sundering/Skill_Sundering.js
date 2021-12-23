//Skill_Sundering class
class Skill_Sundering extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Sundering";
		this.backgroundImageFilePath = "javascripts/raid/Skills/Sundering/icon_sundering.jpg";
		this.cooldown = 40;
		this.range = 100;
		this.isMelee = true;
		this.projectile = Projectile_Sundering;
	}
}
