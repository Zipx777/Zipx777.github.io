//Skill_GhostWolf class
class Skill_GhostWolf extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Ghost Wolf";
		this.backgroundImageFilePath = "javascripts/raid/Skills/GhostWolf/icon_ghostWolf.jpg";
		this.cooldown = 0.5;
		this.playerStatusToApply = Status_GhostWolf;
	}
}
