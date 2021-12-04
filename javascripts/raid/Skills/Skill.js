//Skill class
class Skill {
	constructor(skillId) {
		this.name = "default_skill";
		this.buttonId = skillId || "default_buttonId";
		this.skillButtonElement = $("#" + this.buttonId);
		this.skillButtonCooldownTextElement = $("#" + this.buttonId + " .cooldownTextContainer");
		this.cooldown = 0;
		this.onCooldown = false;
		this.castTime = 0;
		this.cooldownTracker = 0; //temperory counter to track cooldown progress
		this.isMelee = false;
		this.shock = false; //used to synz up shock cooldowns
		this.range = -1; //negative range means infinite range
		this.inRange = true;
		this.projectile = null;
		this.autoActivate = false; //used to let AutoAttack fire at will
		this.playerStatusToApply = null; //applies a status (probably a buff) to player when activated
		this.objectToSpawn = null;
	}

	onCooldown() {
		return this.onCooldown;
	}

	resetCooldown() {
		this.cooldownTracker = 0;
		this.onCooldown = false;
		this.skillButtonCooldownTextElement.text("");
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
			//console.log(this.name + " activated");
			this.cooldownActivated();
			if (this.projectile) {
				var newProj = new this.projectile(player.getX(), player.getY(), new Vector(boss.getX() - player.getX(), boss.getY() - player.getY()));
				newProj.skillOrigin = this.name;
				newProj.isMelee = this.isMelee;
				this.extraProjectileLogic(newProj, player);
				projectiles.push(newProj);
			}
			if (this.playerStatusToApply) {
				var newStatusToApply = new this.playerStatusToApply;
				newStatusToApply.parent = player;
				player.addPlayerStatus(newStatusToApply);
			}
			if (this.totemToSpawn) {
				player.spawnTotem(new this.totemToSpawn);
			}
			return true;
		}
		return false;
	}

	extraUpdateLogic(dt, player) {

	}

	update(dt, player, boss) {
		this.extraUpdateLogic(dt, player);
		var xDistBetween = player.getX() - boss.getX();
		var yDistBetween = player.getY() - boss.getY();
		var distBetweenSquared = Math.pow(xDistBetween, 2) + Math.pow(yDistBetween, 2);
		var distToBoss = Math.sqrt(distBetweenSquared);
		if (distToBoss > this.range && this.range > 0) {
			this.inRange = false;
			if (!this.onCooldown) {
				this.skillButtonElement.addClass("skillOutOfRange");
			}
		} else {
			this.inRange = true;
			if (!this.onCooldown) {
				this.skillButtonElement.removeClass("skillOutOfRange");
			}
		}

		if (this.onCooldown) {
			this.cooldownTracker -= dt;
			var cooldownInSeconds = Math.ceil(this.cooldownTracker)
			this.skillButtonCooldownTextElement.text(cooldownInSeconds);
			if (this.cooldownTracker <= 0) {
				this.onCooldown = false;
				this.cooldownTracker = 0;
				this.skillButtonCooldownTextElement.text("");
				this.skillButtonElement.removeClass("skillOnCooldown");
			}
		}
	}
}
