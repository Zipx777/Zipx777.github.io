//Skill_WindfuryTotem class
class Skill_WindfuryTotem extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Windfury Totem";
		this.cooldown = 60;
		this.playerStatusToApply = Status_Doomwinds;
		this.totemToSpawn = Totem_WindfuryTotem;
	}
}
