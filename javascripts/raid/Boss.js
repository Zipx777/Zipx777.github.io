//Boss class
class Boss {
	constructor(startBossAttackSequence, startX, startY) {
		this.x = startX;
		this.y = startY;
		this.maxHealth = 50000;
		this.currentHealth = 50000;
		this.alive = true;
		this.phase = 0;

		this.speed = 50;
		this.targetDestination = new Vector(this.x,this.y);

		this.teleportActivated = false;
		this.targetTeleportDestination = null;
		this.teleportTimeElapsed = 0;
		this.initialTeleportEffectPlayed = false;
		this.finalTeleportEffectPlayed = false;

		this.color = "black";
		this.radius = 20;
		this.hitboxRadiusPercent = 1;
		this.timeElapsed = 0;

		this.difficulty = "medium";
		this.difficultyColor = "orange";

		this.statuses = [];
		this.damageTexts = [];

		this.bossAttackSequence = startBossAttackSequence;

		this.bossDeathSFXFilePath = "javascripts/raid/BossSounds/bossDeath.wav";
		this.bossDeathSFXVolume = 0.5;

		this.timeElapsed = 0;
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

	setHealth(newHealth) {
		this.maxHealth = newHealth;
		this.currentHealth = newHealth;
	}

	setDifficulty(diff) {
		if (!(diff == "easy" || diff == "medium" || diff == "hard")) {
			alert("Difficulty passed to Boss was invalid");
			return;
		}
		this.difficulty = diff;
		this.bossAttackSequence.difficulty = diff;
		switch (diff) {
			case "easy":
				this.difficultyColor = "green";
				this.setHealth(36000); //target dps: 150 over 4min
				break;
			case "medium":
				this.difficultyColor = "orange";
				this.setHealth(42000); //target dps: 175 over 4min
				break;
			case "hard":
				this.difficultyColor = "red";
				this.setHealth(48000); //target dps: 200 over 4min
				break;
		}
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

	triggerTeleport(destination) {
		this.teleportActivated = true;
		this.targetTeleportDestination = destination;
	}

	handleTeleportLogic(dt, effects) {
		if (this.teleportActivated) {
			if (!this.initialTeleportEffectPlayed) {
				var initialTeleportEffect = new RingEffect(this.targetTeleportDestination.getX(), this.targetTeleportDestination.getY(), "black");
				initialTeleportEffect.setRadius(this.radius / 10);
				initialTeleportEffect.maxRadiusMagnitude = 15;
				initialTeleportEffect.duration = 1.05;
				initialTeleportEffect.maxRadiusPercent = 0.85;
				effects.push(initialTeleportEffect);
				this.initialTeleportEffectPlayed = true;
			}

			if (this.teleportTimeElapsed >= 1) {
				if (!this.finalTeleportEffectPlayed) {
					var finalTeleportEffect = new Effect(this.targetTeleportDestination.getX(), this.targetTeleportDestination.getY(), this.difficultyColor);
					var effectSize = 40;
					if (this.difficulty == "medium") {
						effectSize = 60;
					} else if (this.difficulty == "hard") {
						effectSize = 80;
					}
					finalTeleportEffect.setRadius(effectSize);
					finalTeleportEffect.maxRadiusPercent = 0.1;
					finalTeleportEffect.duration = 0.5;
					effects.push(finalTeleportEffect);

					var finalTeleportRingEffect = new RingEffect(this.targetTeleportDestination.getX(), this.targetTeleportDestination.getY(), this.difficultyColor);
					finalTeleportRingEffect.setRadius(this.radius);
					finalTeleportRingEffect.maxRadiusPercent = 1;
					finalTeleportRingEffect.maxRadiusMagnitude = 30;
					finalTeleportRingEffect.duration = 3;
					finalTeleportRingEffect.fadeOut = true;
					effects.push(finalTeleportRingEffect);

					var finalTeleportRingEffect2 = new RingEffect(this.targetTeleportDestination.getX(), this.targetTeleportDestination.getY(), this.difficultyColor);
					finalTeleportRingEffect2.setRadius(effectSize);
					finalTeleportRingEffect2.maxRadiusPercent = 1;
					finalTeleportRingEffect2.maxRadiusMagnitude = 1.5;
					finalTeleportRingEffect2.duration = 1;
					finalTeleportRingEffect2.ringWidth = 2;
					finalTeleportRingEffect2.fadeOut = true;
					effects.push(finalTeleportRingEffect2);

					this.finalTeleportEffectPlayed = true;
				}
			}

			if (this.teleportTimeElapsed >= 1.1) {
				this.x = this.targetTeleportDestination.getX();
				this.y = this.targetTeleportDestination.getY();
				this.teleportActivated = false;
				this.targetTeleportDestination = null;
			}

			this.teleportTimeElapsed += dt;
		}
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
			//console.log("Damage from " + damageSourceName + ": " + Math.floor(adjustedDamageValue));
			var newDamageText = new DamageText(damageSourceName, this.x, this.y - this.radius, adjustedDamageValue, damageColor);
			if (damageSourceName == "Status_FlameShock" || damageSourceName == "Windfury Weapon" || damageSourceName == "Auto Attack") {
				newDamageText.isSmall = true;
			}
			this.damageTexts.push(newDamageText);
		}
	}

	updateTimer() {
		var fightDurationTotalSeconds = 240; //matches up with BossAttackSequence timing
		var secondsElapsed = Math.floor(this.timeElapsed);
		var totalSecondsRemaining = fightDurationTotalSeconds - secondsElapsed;

		var timeUp = false;
		if (totalSecondsRemaining < 0) {
			timeUp = true;
			totalSecondsRemaining = Math.abs(totalSecondsRemaining);
		}

		var timeRemaining_secondsPart = totalSecondsRemaining % 60;
		var timeRemaining_minutesPart = Math.floor(totalSecondsRemaining / 60);;

		var minutesText = timeRemaining_minutesPart + ":";
		if (timeUp) {
			minutesText = "-" + minutesText;
			$("#timerDiv").css("color", "red");
		}
		var secondsText = "";
		if (timeRemaining_secondsPart == 0) {
			secondsText = "00";
		} else if (timeRemaining_secondsPart < 10) {
			secondsText ="0" + timeRemaining_secondsPart;
		} else {
			secondsText = timeRemaining_secondsPart;
		}
		$("#timerDiv").text(minutesText + secondsText);
	}

	//update Boss position/atacks
	update(dt, player, boss, effects, ctx) {
		this.handleTeleportLogic(dt, effects);

		if (!this.fightStarted || !this.isAlive()) {
			return;
		}

		this.updateTimer();

		this.bossAttackSequence.update(dt, player, boss, ctx);

		var tempStatuses = [];
		for (var i = 0; i < this.statuses.length; i++) {
			this.statuses[i].update(dt);
			if (!this.statuses[i].isFinished()) {
				tempStatuses.push(this.statuses[i]);
			}
		}
		this.statuses = tempStatuses;

		var activeDamageTexts = [];
		$.each(this.damageTexts, function(i, nextDamageText) {
			if (!nextDamageText.isFinished()) {
				nextDamageText.update(dt);
				activeDamageTexts.push(nextDamageText);
			}
		});
		this.damageTexts = activeDamageTexts;

		if (this.currentHealth <= 0) {
			this.alive = false;

			if (this.bossDeathSFXFilePath && this.bossDeathSFXVolume > 0) {
				var bossDeathSFX = new Audio(this.bossDeathSFXFilePath);
				bossDeathSFX.volume = this.bossDeathSFXVolume;
				bossDeathSFX.play();
			}
		}

		var xDiff = this.targetDestination.getX() - this.x;
		var yDiff = this.targetDestination.getY() - this.y;
		var distToTargetDistSquared = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
		var distToTravelThisTick = this.speed * dt;
		if (distToTargetDistSquared <= Math.pow(distToTravelThisTick, 2)) {
			this.x = this.targetDestination.getX();
			this.y = this.targetDestination.getY();
		} else {
			var movementVector = new Vector(xDiff, yDiff);
			movementVector = movementVector.normalize().multiply(distToTravelThisTick);
			this.x += movementVector.getX();
			this.y += movementVector.getY();
		}

		this.timeElapsed += dt;
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

		ctx.beginPath();
		ctx.fillStyle = this.difficultyColor;
		ctx.arc(this.x, this.y, this.radius * 0.2, 0, 2 * Math.PI, true);
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
			ctx.arc(this.x, this.y, (this.radius) * (flameShockStatus.duration - flameShockStatus.timeElapsed) * 0.8 / flameShockStatus.duration, 0, 2 * Math.PI, true);
			ctx.stroke();
		}
		ctx.restore();

		$.each(this.damageTexts, function(i, dT) {
			if (dT.isSmall) {
				dT.draw(ctx);
			}
		});

		//write bigger number over the smaller oness
		$.each(this.damageTexts, function(i, dT) {
			if (!dT.isSmall) {
				dT.draw(ctx);
			}
		});
	}
}
