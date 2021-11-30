//Boss class
class Boss {
	constructor(startBossAttackSequence, startX, startY) {
		this.x = startX;
		this.y = startY;
		this.maxHealth = 50000;
		this.currentHealth = 50000;
		this.alive = true;
		this.phase = 0;

		this.speed = 5;
		this.color = "black";
		this.radius = 20;
		this.hitboxRadiusPercent = 1;
		this.tickCount = 0;

		this.statuses = [];
		this.damageTexts = [];

		this.bossAttackSequence = startBossAttackSequence;
		this.explosionSFXFilePath = "sounds/turrets/playerDeath.wav";
		this.explosionSFXVolume = 1;

		this.tickCount = 0;

		this.fightStarted = false;

		this.damageReport = {};
	}

	//return value of x
	getX() {
		return this.x;
	}

	//return value of y
	getY() {
		return this.y;
	}

	//set new value for x
	setX(newX) {
		this.x = newX;
	}

	//set new value for y
	setY(newY) {
		this.y = newY;
	}

	//return value of radius
	getRadius() {
		return this.radius;
	}

	getHitboxRadius() {
		return this.radius * this.hitboxRadiusPercent;
	}

	isAlive() {
		return this.alive;
	}

	getStatus(statusName) {
		for (var i = 0; i < this.statuses.length; i++) {
			if (this.statuses[i].name == statusName) {
				return this.statuses[i];
			}
		}
		return null;
	}

	handleHitByProjectile(proj) {
		if (proj.damage > 0) {
			this.takeDamage(proj.skillOrigin, proj.damage, proj.color);
		}

		if (proj.statusToApply != null) {
			var refreshedStatus = false; //remember if we just updated an existing status instead of adding a new one
			var newStatus = proj.getNewStatusToApply(); //have to do this instead of just referencing proj's variable to avoid error
			for (var i = 0; i < this.statuses.length; i++) {
				if (this.statuses[i].name == newStatus.name) {
					this.statuses[i].refresh();
					refreshedStatus = true;
				}
			}
			if (!refreshedStatus) {
				newStatus.parent = this;
				this.statuses.push(newStatus);
			}
		}
	}

	takeDamage(damageSourceName, damageValue, damageColor) {
		var damageVariability = 0.2;
		var randomVariance = ((Math.random() * 2) - 1) * damageVariability;
		var adjustedDamageValue = damageValue * (1 + randomVariance);
		if (this.isAlive()) {
			this.fightStarted = true;
			this.currentHealth = Math.max(0, this.currentHealth - adjustedDamageValue);
			if (!this.damageReport[damageSourceName]) {
				this.damageReport[damageSourceName] = adjustedDamageValue;
			} else {
				this.damageReport[damageSourceName] += adjustedDamageValue;
			}
			console.log("Damage from " + damageSourceName + ": " + Math.floor(adjustedDamageValue));
			var newDamageText = new DamageText(damageSourceName, this.x, this.y - this.radius, adjustedDamageValue, damageColor);
			if (damageSourceName == "Status_FlameShock" || damageSourceName == "Windfury Weapon" || damageSourceName == "Auto Attack") {
				newDamageText.isSmall = true;
			}
			this.damageTexts.push(newDamageText);
		}
	}

	//update Boss position/atacks
	update(player, boss, ctx) {
		if (!this.fightStarted || !this.isAlive()) {
			return;
		}

		this.bossAttackSequence.update(player, boss, ctx);

		var tempStatuses = [];
		for (var i = 0; i < this.statuses.length; i++) {
			this.statuses[i].update();
			if (!this.statuses[i].isFinished()) {
				tempStatuses.push(this.statuses[i]);
			}
		}
		this.statuses = tempStatuses;

		var activeDamageTexts = [];
		$.each(this.damageTexts, function(i, dT) {
			if (!dT.isFinished()) {
				dT.update();
				activeDamageTexts.push(dT);
			}
		});
		this.damageTexts = activeDamageTexts;

		if (this.currentHealth <= 0) {
			this.alive = false;
		}

		this.tickCount++;
	}

	//draws Boss on canvas context passed to it
	draw(ctx) {
		ctx.save();
		this.bossAttackSequence.draw(ctx);


		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.restore();

		if (this.phase == 1 || this.phase == 4 || this.phase == 6) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.fillStyle = "purple";
			ctx.arc(this.x, this.y, this.radius/2, 0 - (Math.PI/2) - (2 * Math.PI/6), 0 - (Math.PI / 6) , false);
			ctx.fill();
			ctx.restore();
		}

		if (this.phase == 2 || this.phase == 4 || this.phase == 5 || this.phase == 6) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.fillStyle = "crimson";
			ctx.arc(this.x, this.y, this.radius/2, 0 - (3 * Math.PI / 2), 0 - (5 * Math.PI / 6) , false);
			ctx.fill();
			ctx.restore();
		}

		if (this.phase == 3 || this.phase == 5 || this.phase == 6) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.fillStyle = "lightgray";
			ctx.arc(this.x, this.y, this.radius/2, 0 + (Math.PI / 2), 0 - (Math.PI / 6) , true);
			ctx.fill();
			ctx.restore();
		}

		//flameshock
		var flameShockStatus = this.getStatus("Status_FlameShock");
		if (flameShockStatus) {
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius) * (flameShockStatus.duration - flameShockStatus.tickCount) * 0.8 / flameShockStatus.duration, 0, 2 * Math.PI, true);
			ctx.stroke();
		}
		ctx.restore();

		$.each(this.damageTexts, function(i, dT) {
			if (dT.isSmall) {
				dT.draw(ctx);
			}
		});

		$.each(this.damageTexts, function(i, dT) {
			if (!dT.isSmall) {
				dT.draw(ctx);
			}
		});
	}
}
