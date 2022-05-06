//Skill_FeralSpirit class
class Skill_FeralSpirit extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Feral Spirit";
		this.backgroundImageFilePath = "javascripts/raid/Skills/FeralSpirit/icon_feralSpirit.jpg";
		this.cooldown = 120;
		this.playerStatusToApply = Status_FeralSpirit;

		this.activateSoundFilePath = "javascripts/raid/Skills/FeralSpirit/feralSpiritActivate.wav";
	}

	extraActivateLogic(player) {
		player.addMaelstromStack();
	}

	triggerSkillActivatedEffect(player, effects) {
		var newActivateEffect = new PlayerSkillActivatedEffect(player, "orange");
		effects.push(newActivateEffect);
	}
}
