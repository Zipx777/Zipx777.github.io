//Skill_AutoAttack class
class Skill_AutoAttack extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Auto Attack";
		this.autoActivate = true;
		this.baseCooldown = 2.1;
		this.cooldown = 2.1;
		this.isMelee = true;
		this.baseRange = 100;
		this.range = 100;

		this.numProj = 2;
		this.projectile = Projectile_AutoAttack;
	}

	extraNumberOfProjectilesLogic(player) {
		var extraProjectilesToFire = 0;
		var windfuryTotemStatus = player.getStatus("Status_WindfuryTotem");
		if (windfuryTotemStatus != null) {
			if (Math.random() <= windfuryTotemStatus.procChance) {
				extraProjectilesToFire += windfuryTotemStatus.extraProjectilesOnProc;
			}
		}
		return extraProjectilesToFire;
	}

	extraProjectileLogic(newProj, player, isFinalProj) {
		var ascendanceStatus = player.getStatus("Status_Ascendance");
		if (ascendanceStatus) {
			newProj.damage = newProj.damage * ascendanceStatus.autoAttackDamageMultiplier;
			newProj.ascendanceBuff = true;
		}
	}

	extraUpdateLogic(dt, player) {
		this.range = this.baseRange;
		var ascendanceStatus = player.getStatus("Status_Ascendance");
		if (ascendanceStatus) {
			this.range = ascendanceStatus.meleeRange;
		}
		this.cooldown = this.baseCooldown * player.hasteMultiplier;
		this.cooldownTracker = Math.min(this.cooldownTracker, this.cooldown);
	}
}
