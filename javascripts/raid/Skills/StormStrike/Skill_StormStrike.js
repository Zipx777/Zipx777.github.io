//Skill_StormStrike class
class Skill_StormStrike extends Skill {
	constructor(skillId) {
		super(skillId);
		this.name = "Storm Strike";
		this.baseCooldown = 7.5; //remember cooldown for after Ascendance ends
		this.cooldown = 7.5;
		this.baseRange = 100;
		this.range = 100;
		this.numProj = 2;
		this.color = "blue";
		this.isMelee = true;

		this.projectile = Projectile_StormStrike;
	}

	//return true if skill successfully activates
	activate(ctx, player, bosss, projectiles) {
		if (!this.onCooldown && this.inRange) {
			//console.log(this.name + " activated");
			this.cooldownActivated();
			var vectorToBoss = new Vector(boss.getX() - player.getX(), boss.getY() - player.getY());
			var newProj;
			var spawnFacingVector
			for (var i = 0; i < this.numProj; i++) {
				spawnFacingVector = new Vector(1,1);
				spawnFacingVector.setAngle(vectorToBoss.toAngle());
				var tempAngle = spawnFacingVector.toAngle();
				tempAngle += (Math.PI/12 * Math.pow(-1, i));
				tempAngle += ((Math.random() * 0.2) - 0.1);
				spawnFacingVector.setAngle(tempAngle);
				newProj = new this.projectile(player.getX(), player.getY(), spawnFacingVector);
				newProj.skillOrigin = this.name;
				newProj.isMelee = this.isMelee;

				var ascendanceStatus = player.getStatus("Status_Ascendance");
				if (ascendanceStatus) {
					newProj.damage = newProj.damage * ascendanceStatus.stormstrikeDamageMultiplier;
				}

				if (player.stormbringerBuff) {
					newProj.damage = newProj.damage * 1.25;
				}

				projectiles.push(newProj);
			}
			this.skillButtonElement.removeClass("skillProcced");
			player.stormbringerBuff = false;
			return true;
		}
		return false;
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
