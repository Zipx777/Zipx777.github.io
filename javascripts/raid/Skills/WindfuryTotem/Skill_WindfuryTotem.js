//Skill_WindfuryTotem class
class Skill_WindfuryTotem extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Windfury Totem";
		this.backgroundImageFilePath = "javascripts/raid/Skills/WindfuryTotem/icon_windfuryTotem.jpg";
		this.cooldown = 50;
		this.playerStatusToApply = Status_Doomwinds;
		this.totemToSpawn = Totem_WindfuryTotem;
	}
}
