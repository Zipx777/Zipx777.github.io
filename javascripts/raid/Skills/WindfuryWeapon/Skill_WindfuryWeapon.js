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

	//return true if skill successfully activates
	activate(ctx, player, bosss, projectiles) {
		if (!this.onCooldow) {
			console.log(this.name + " activated");
			if (this.cooldown > 0) {
				this.onCooldown = true;
				this.cooldownTracker = this.cooldown;
			}

			var vectorToBoss = new Vector(boss.getX() - player.getX(), boss.getY() - player.getY());
			var newProj;
			var spawnFacingVector
			for (var i = 0; i < this.numProj; i++) {
				spawnFacingVector = new Vector(1,1);
				spawnFacingVector.setAngle(vectorToBoss.toAngle());
				var tempAngle = spawnFacingVector.toAngle();
				tempAngle += (Math.PI/18 * Math.pow(-1, i));
				tempAngle += ((Math.random() * 0.2) - 0.1);
				spawnFacingVector.setAngle(tempAngle);
				newProj = new this.projectile(player.getX(), player.getY(), spawnFacingVector);
				newProj.skillOrigin = this.name;
				newProj.isMelee = this.isMelee;
				var doomwindsStatus = player.getStatus("Status_Doomwinds");
				if (doomwindsStatus) {
					newProj.damage = newProj.damage * doomwindsStatus.doomwindsWindfuryDamageMultiplier;
				}
				projectiles.push(newProj);
			}
			return true;
		}
		return false;
	}
}
