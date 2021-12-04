//Skill_Bloodlust class
class Skill_Bloodlust extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Bloodlust";
		this.cooldown = 600;
		this.playerStatusToApply = Status_Bloodlust;
	}
}
