//Skill_Bloodlust class
class Skill_Bloodlust extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Bloodlust";
		this.backgroundImageFilePath = "javascripts/raid/Skills/Bloodlust/icon_bloodlust.jpg";
		this.cooldown = 240;
		this.playerStatusToApply = Status_Bloodlust;

		this.activateSoundFilePath = "javascripts/raid/Skills/Bloodlust/bloodlustActivate.wav";
	}

	triggerSkillActivatedEffect(player, effects) {
		var newActivateEffect = new PlayerSkillActivatedEffect(player, "purple");
		effects.push(newActivateEffect);
	}
}
