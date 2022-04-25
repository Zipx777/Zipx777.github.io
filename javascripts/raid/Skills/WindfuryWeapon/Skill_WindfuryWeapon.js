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

	extraProjectileLogic(newProj, player, isFinalProj) {
		var ascendanceStatus = player.getStatus("Status_Ascendance");
		if (ascendanceStatus) {
			newProj.damage = newProj.damage * ascendanceStatus.windfuryWeaponDamageMultiplier;
			newProj.ascendanceBuff = true;
		}
	}
}
