//Skill_FeralSpirit class
class Skill_FeralSpirit extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Feral Spirit";
		this.cooldown = 120;
		this.playerStatusToApply = Status_FeralSpirit;
	}

	extraActivateLogic(player) {
		player.addMaelstromStack();
	}
}
