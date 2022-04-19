//Skill_Ascendance class
class Skill_Ascendance extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Ascendance";
		this.backgroundImageFilePath = "javascripts/raid/Skills/Ascendance/icon_ascendance.jpg";
		this.cooldown = 150;
		this.playerStatusToApply = Status_Ascendance;
	}
}
