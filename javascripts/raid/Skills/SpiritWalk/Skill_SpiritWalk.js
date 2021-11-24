//Skill_SpiritWalk class
class Skill_SpiritWalk extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Spirit Walk";
		this.cooldown = 3600;
		this.playerStatusToApply = Status_SpiritWalk;
	}
}
