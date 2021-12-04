//Skill_Ascendance class
class Skill_Ascendance extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Ascendance";
		this.cooldown = 180;
		this.playerStatusToApply = Status_Ascendance;
	}
}
