//Skill_WindfuryWeapon class
class Skill_WindfuryWeapon extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Windfury Weapon";
		this.cooldown = 0;
		this.numProj = 2;
		this.color = "blue";
		this.isMelee = true;

		this.projectile = Projectile_WindfuryWeapon;
	}

	extraSpawnFacingLogic(initialAngle, i) {
		var newAngle = initialAngle;
		newAngle += (Math.PI/18 * Math.pow(-1, i));
		newAngle += ((Math.random() * 0.2) - 0.1);
		return newAngle;
	}
}
