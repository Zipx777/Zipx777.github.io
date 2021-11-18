//Skill class
class Skill {
	constructor(skillId) {
		this.name = "default_skill";
		this.buttonId = skillId || "default_buttonId";
		this.skillButtonElement = $("#" + this.buttonId);
		this.cooldown = 0;
		this.onCooldown = false;
		this.castTime = 0;
		this.cooldownTracker = 0; //temperory counter to track cooldown progress
		this.isMelee = false;
		this.shock = false; //used to synz up shock cooldowns
		this.range = 100;
		this.inRange = true;
		this.projectile = Projectile;
		this.autoActivate = false; //used to let AutoAttack fire at will
		this.playerStatusToApply = null; //applies a status (probably a buff) to player when activated
	}

	onCooldown() {
		return this.onCooldown;
	}

	resetCooldown() {
		this.cooldownTracker = 0;
		this.onCooldown = false;
		this.skillButtonElement.text("");
		this.skillButtonElement.removeClass("skillOnCooldown");
	}

	cooldownActivated() {
		this.onCooldown = true;
		this.cooldownTracker = this.cooldown;
		this.skillButtonElement.addClass("skillOnCooldown");
	}

	readyToActivate() {
		return (!this.onCooldown && this.inRange);
	}

	extraActivateLogic(player) {

	}

	extraProjectileLogic(proj) {

	}

	//return true if skill successfully activates
	activate(ctx, player, bosss, projectiles) {
		if (this.readyToActivate()) {
			this.extraActivateLogic(player);
			console.log(this.name + " activated");
			this.cooldownActivated();
			var newProj = new this.projectile(player.getX(), player.getY(), new Vector(boss.getX() - player.getX(), boss.getY() - player.getY()));
			newProj.skillOrigin = this.name;
			newProj.isMelee = this.isMelee;
			this.extraProjectileLogic(newProj, player);
			projectiles.push(newProj);
			return true;
		}
		return false;
	}

	extraUpdateLogic(player) {

	}

	update(player, boss) {
		this.extraUpdateLogic(player);
		if (this.onCooldown) {
			this.cooldownTracker--;
			this.skillButtonElement.text(this.cooldownTracker);
			if (this.cooldownTracker <= 0) {
				this.onCooldown = false;
				this.cooldownTracker = 0;
				this.skillButtonElement.text("");
				this.skillButtonElement.removeClass("skillOnCooldown");
			}
		} else {
			var xDistBetween = player.getX() - boss.getX();
			var yDistBetween = player.getY() - boss.getY();
			var distBetweenSquared = Math.pow(xDistBetween, 2) + Math.pow(yDistBetween, 2);
			var distToBoss = Math.sqrt(distBetweenSquared);
			if (distToBoss > this.range) {
				if (this.inRange) {
					this.inRange = false;
					this.skillButtonElement.addClass("skillOutOfRange");
				}
			} else {
				if (!this.inRange) {
					this.inRange = true;
					this.skillButtonElement.removeClass("skillOutOfRange");
				}
			}
		}
	}
}
