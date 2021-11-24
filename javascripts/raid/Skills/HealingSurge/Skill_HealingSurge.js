//Skill_HealingSurge class
class Skill_HealingSurge extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Healing Surge";
		this.cooldown = -1;
		this.castTime = 150;
	}
}
