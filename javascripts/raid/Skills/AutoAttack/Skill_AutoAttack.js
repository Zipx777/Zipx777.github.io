//Skill_AutoAttack class
class Skill_AutoAttack extends Skill {
	constructor(name, skillId, cooldown) {
		super(name, skillId, cooldown);
		this.name = "Auto Attack";
		this.autoActivate = true;
		this.cooldown = 130;
		this.isMelee = true;
		this.range = 100;

		this.numProj = 2;
		this.projectile = Projectile_AutoAttack;
	}

	//return true if skill successfully activates
	activate(ctx, player, bosss, projectiles) {
		if (!this.onCooldown && this.inRange) {
			console.log(this.name + " activated");
			this.onCooldown = true;
			this.cooldownTracker = this.cooldown;
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
				projectiles.push(newProj);
			}
			return true;
		}
		return false;
	}

	update(player, boss) {
		var xDistBetween = player.getX() - boss.getX();
		var yDistBetween = player.getY() - boss.getY();
		var distBetweenSquared = Math.pow(xDistBetween, 2) + Math.pow(yDistBetween, 2);
		var distToBoss = Math.sqrt(distBetweenSquared);
		if (this.onCooldown) {
			this.cooldownTracker--;
			if (this.cooldownTracker <= 0) {
				this.onCooldown = false;
			}
		}

		if (distToBoss <= this.range) {
			this.inRange = true;
		} else {
			this.inRange = false;
		}
	}
}
