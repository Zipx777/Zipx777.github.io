//Skill_WindfuryTotem class
class Skill_WindfuryTotem extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Windfury Totem";
		this.cooldown = 3600;
		this.playerStatusToApply = Status_Doomwinds;
		this.totemToSpawn = Totem_WindfuryTotem;
	}
}
