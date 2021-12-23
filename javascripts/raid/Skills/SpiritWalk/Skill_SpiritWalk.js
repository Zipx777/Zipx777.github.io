//Skill_SpiritWalk class
class Skill_SpiritWalk extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Spirit Walk";
		this.backgroundImageFilePath = "javascripts/raid/Skills/SpiritWalk/icon_spiritWalk.jpg";
		this.cooldown = 60;
		this.playerStatusToApply = Status_SpiritWalk;
	}
}
