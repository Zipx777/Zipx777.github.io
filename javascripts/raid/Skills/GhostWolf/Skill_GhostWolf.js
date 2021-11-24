//Skill_GhostWolf class
class Skill_GhostWolf extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Ghost Wolf";
		this.cooldown = 30;
		this.playerStatusToApply = Status_GhostWolf;
	}
}
