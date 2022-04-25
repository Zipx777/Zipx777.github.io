//Skill_StormStrike class
class Skill_StormStrike extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Storm Strike";
		this.backgroundImageFilePath = "javascripts/raid/Skills/StormStrike/icon_stormStrike.jpg";
		this.baseCooldown = 7.5; //remember cooldown for after Ascendance ends
		this.cooldown = 7.5;
		this.baseRange = 100;
		this.range = 100;
		this.numProj = 2;
		this.color = "blue";
		this.isMelee = true;

		this.projectile = Projectile_StormStrike;
	}

	extraProjectileLogic(newProj, player, isFinalProj) {
		var ascendanceStatus = player.getStatus("Status_Ascendance");
		if (ascendanceStatus) {
			newProj.damage = newProj.damage * ascendanceStatus.stormstrikeDamageMultiplier;
		}

		if (player.stormbringerBuff) {
			newProj.damage = newProj.damage * player.stormbringerDamageBonus
			newProj.stormbringerBuff = true;;
			if (isFinalProj) {
				player.stormbringerBuff = false;
				this.skillButtonElement.removeClass("skillProcced");
			}
		}
	}

	extraUpdateLogic(dt, player) {
		this.cooldown = this.baseCooldown * player.hasteMultiplier;
		this.range = this.baseRange;
		var ascendanceStatus = player.getStatus("Status_Ascendance");
		if (ascendanceStatus) {
			this.cooldown = this.cooldown * ascendanceStatus.stormstrikeCooldownMultiplier;
			this.range = ascendanceStatus.meleeRange;
		}
		this.cooldownTracker = Math.min(this.cooldownTracker, this.cooldown);
	}
}
