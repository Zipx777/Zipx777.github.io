//Player class
class Player {
	constructor(startX, startY) {
		this.x = startX;
		this.y = startY;
		this.speed = 2 * 60;
		this.color = "blue";
		this.gcdColor = "white";
		this.castingColor = "aqua";
		this.radius = 15;
		this.hitboxRadiusPercent = 0.5;
		this.isMoving = false;

		this.timeSinceLastDamage = -1;
		this.timeBetweenDamageTicks = 0.25;

		this.baseGcdCooldown = 1.5;
		this.gcdCooldown = this.baseGcdCooldown;
		this.gcdTracker = 0;

		this.skillToCast = null;
		this.castingTimer = 0;

		this.maxHealth = 500;
		this.currentHealth = this.maxHealth;

		this.maxMana = 100;
		this.currentMana = 100;
		this.manaRegenPerTick = 0.01;

		this.skills = [
			new Skill_LightningBolt("skill_1"),
			new Skill_StormStrike("skill_2"),

			new Skill_LavaLash("skill_3"),
			new Skill_FlameShock("skill_4"),
			new Skill_FrostShock("skill_5"),
			new Skill_CrashLightning("skill_6"),

			new Skill_Bloodlust("skill_7"),
			new Skill_Ascendance("skill_8"),
			new Skill_FeralSpirit("skill_9"),
			new Skill_WindfuryTotem("skill_10"),
			new Skill_Sundering("skill_11"),

			new Skill_SpiritWalk("skill_12"),
			new Skill_GhostWolf("skill_13"),

			new Skill_AutoAttack(),
			new Skill_WindfuryWeapon()
		];

		this.totems = [];
		this.statuses = [];

		this.maelstromChance = 0.2;
		this.maelstromStacks = 0;
		this.snapshotMaelstromStacks = 0; //how many stacks were there when lightning bolt started casting

		this.baseHasteMultiplier = 0.8; //save base haste
		this.hasteMultiplier = 0.8; //speeds up auto attack and melee cooldowns

		this.stormbringerChance = 0.05;
		this.stormbringerDamageBonus = 1.25;
		this.stormbringerBuff = false;

		this.windfuryWeaponChance = 0.2;

		this.autoAttackTotalUptime = 0;
		this.maelstromStacksGenerated = 0;
		this.maelstromStacksWasted = 0;
		this.flameShockTotalUptime = 0;
		this.gcdUptime = 0;

		this.skillUses = {};

		this.playerDamagedSFXFilePath = "javascripts/raid/PlayerSounds/playerDamaged.wav";
		this.playerDamagedSFXVolume = 0.5;

		this.playerDeathSFXFilePath = "javascripts/raid/PlayerSounds/playerDeath.wav";
		this.playerDeathSFXVolume = 0.5;

		this.controlMode = 2; //1 = mouse, 2 = wasd
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
		switch (diff) {
			case "easy":
				this.setHealth(1000);
				break;
			case "medium":
				this.setHealth(500);
				break;
			case "hard":
				this.setHealth(300);
				break;
		}
	}

	setControlMode(mode) {
		this.controlMode = mode;
	}

	//return value of radius
	getRadius() {
		return this.radius;
	}

	getHitboxRadius() {
		return this.radius * this.hitboxRadiusPercent;
	}

	getControlMode() {
		return this.controlMode;
	}

	addPlayerStatus(newStatus) {
		if (newStatus.toggles && this.getStatus(newStatus.name)) {
			this.removeStatus(newStatus.name);
		} else {
			this.statuses.push(newStatus);
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

	removeStatus(statusName) {
		var preservedStatuses = [];
		for (var i = 0; i < this.statuses.length; i++) {
			if (this.statuses[i].name != statusName) {
				preservedStatuses.push(this.statuses[i]);
			}
		}
		this.statuses = preservedStatuses;
	}

	spawnTotem(newTotem) {
		newTotem.x = this.x + this.radius + 10;
		newTotem.y = this.y;
		this.totems.push(newTotem);
	}

	addMaelstromStack() {
		this.maelstromStacks += 1;
		this.maelstromStacksGenerated++;
		if (this.maelstromStacks > 10) {
			this.maelstromStacks = 10;
			this.maelstromStacksWasted++;
		}
	}

	setStartingHealth(value) {
		this.maxHealth = value;
		this.currentHealth = this.maxHealth;
	}

	takeDamage(damageAmount) {
		if (this.isAlive()) {
			this.currentHealth -= damageAmount;
			if (this.timeSinceLastDamage < 0) {
				this.timeSinceLastDamage = 0;

				if (this.isAlive()) {
					if (this.playerDamagedSFXFilePath && this.playerDamagedSFXVolume > 0) {
						var playerDamagedSFX = new Audio(this.playerDamagedSFXFilePath);
						playerDamagedSFX.volume = this.playerDamagedSFXVolume;
						playerDamagedSFX.play();
					}
				}
			}
			if (!this.isAlive()) {
				if (this.playerDeathSFXFilePath && this.playerDeathSFXVolume > 0) {
					var playerDeathSFX = new Audio(this.playerDeathSFXFilePath);
					playerDeathSFX.volume = this.playerDeathSFXVolume;
					playerDeathSFX.play();
				}
			}
		}
	}

	stopCasting() {
		this.skillToCast = null;
		this.castingTimer = 0; //should be unnecessary
		$(".skillCasting").removeClass("skillCasting");
	}

	isAlive() {
		return this.currentHealth > 0;
	}

	getSkillByName(name) {
		for (var i = 0; i < this.skills.length; i++) {
			if (this.skills[i].name == name) {
				return this.skills[i];
			}
		}
		console.log("ERROR: " + name + " skill wasn't found");
		return null;
	}

	stormbringerProc() {
		var stormStrikeSkill = this.getSkillByName("Storm Strike");
		if (stormStrikeSkill) {
			stormStrikeSkill.resetCooldown();
			stormStrikeSkill.skillButtonElement.removeClass("skillProced");
			stormStrikeSkill.skillButtonElement.addClass("skillProcced");
			this.stormbringerBuff = true;

			var procSFX = new Audio("javascripts/raid/Skills/StormStrike/stormbringerProc.wav");
			procSFX.volume = 0.25;
			procSFX.play();
		}
	}

	handleProjectileImpactLogic(proj, projectiles) {
		if (proj.isMelee) {
			//stormbringer
			if (proj.skillOrigin != "Auto Attack") {
				if (Math.random() <= this.stormbringerChance) {
					if (!this.stormbringerBuff) {
						this.stormbringerProc();
					}
				}
			}

			//windfury weapon
			var windfuryChance = this.windfuryWeaponChance;
			var doomwindsStatus = this.getStatus("Status_Doomwinds");
			if (doomwindsStatus) {
				windfuryChance = doomwindsStatus.doomwindsWindfuryChance;
			}
			if (proj.skillOrigin != "Windfury Weapon") {
				if (Math.random() <= windfuryChance) {
					var windfuryWeaponSkill = this.getSkillByName("Windfury Weapon");
					if (windfuryWeaponSkill) {
						windfuryWeaponSkill.activate(ctx, this, boss, projectiles);
					}
				}
			}

			//maelstrom
			if (Math.random() <= this.maelstromChance) {
				this.addMaelstromStack();
			}
		}
	}

	attemptToActivateSkill(skillId) {
		if (this.gcdTracker <= 0) {
			var skillToActivate = skillButtons[skillId];
			if (skillToActivate.readyToActivate() && !(this.isMoving && skillToActivate.castTime > 0) && !this.skillToCast) {
				this.castingTimer = skillToActivate.castTime;
				this.skillToCast = skillToActivate;
				if (skillToActivate.playerStatusToApply != Status_GhostWolf && skillToActivate.name != "Spirit Walk") {
					this.removeStatus("Status_GhostWolf");
				}
				if (this.skillToCast.name == "Lightning Bolt") {
					this.snapshotMaelstromStacks = Math.min(5, this.maelstromStacks);
				}

				this.gcdTracker = this.gcdCooldown;
				skillSelectedID = null;
				skillSelectBufferTracker = 0;
				$(".skillSelected").removeClass("skillSelected");
			}
		}
	}

	countSkillUse(skillName) {
		if (!this.skillUses[skillName]) {
			this.skillUses[skillName] = [];
			this.skillUses[skillName] = 1;
		} else {
			this.skillUses[skillName] += 1;
		}
	}

	//update Player position and skills
	update(dt, targetX, targetY, keys, player, boss, projectiles, effects, gameStarted, ctx) {

		//track postgame stats
		if (boss.fightStarted) {
			var autoAttackSkill = this.getSkillByName("Auto Attack");
			if (autoAttackSkill.onCooldown) {
				this.autoAttackTotalUptime += dt;
			}

			if (boss.getStatus("Status_FlameShock")) {
				this.flameShockTotalUptime += dt;
			}

			if (this.gcdTracker > 0) {
				this.gcdUptime += dt;
			}
		}

		this.currentMana = Math.min(this.currentMana + this.manaRegenPerTick, this.maxMana);

		this.hasteMultiplier = this.baseHasteMultiplier;
		var bloodlustStatus = this.getStatus("Status_Bloodlust");
		if (bloodlustStatus) {
			this.hasteMultiplier = this.baseHasteMultiplier * bloodlustStatus.bloodlustAttackCooldownMultiplier;
		}

		var currentSpeed = this.speed;

		var spiritWalkStatus = this.getStatus("Status_SpiritWalk");
		if (spiritWalkStatus) {
			currentSpeed *= spiritWalkStatus.spiritWalkSpeedMultiplier;
		}

		var ghostWolfStatus = this.getStatus("Status_GhostWolf");
		if (ghostWolfStatus) {
			currentSpeed *= ghostWolfStatus.ghostWolfSpeedMultiplier;
		}

		//save starting x,y to compare after, to check for movement
		var saveStartX = this.x;
		var saveStartY = this.y;

		var movementVector = new Vector(0,0);

		//update movement
		if (this.controlMode == 1) {
			movementVector = new Vector(targetX - this.x, targetY - this.y);
			var xDiffMouse = Math.abs(this.x - targetX);
			var yDiffMouse = Math.abs(this.y - targetY);
			movementVector = movementVector.normalize().multiply(currentSpeed).multiply(dt);
			if (movementVector.length() > 0) {
				if (xDiffMouse < Math.abs(movementVector.getX())) {
					this.x = targetX;
				} else {
					this.x += movementVector.getX();
				}

				if (yDiffMouse < Math.abs(movementVector.getY())) {
					this.y = targetY;
				} else {
					this.y += movementVector.getY();
				}
			}
		} else if (this.controlMode == 2) {
			if (keys.up) {
				movementVector.setY(movementVector.getY() - 1);
			}

			if (keys.down) {
				movementVector.setY(movementVector.getY() + 1);
			}

			if (keys.left) {
				movementVector.setX(movementVector.getX() - 1);
			}

			if (keys.right) {
				movementVector.setX(movementVector.getX() + 1);
			}

			if (movementVector.length() > 0) {
				movementVector = movementVector.normalize().multiply(currentSpeed).multiply(dt);
				this.x += movementVector.getX();
				this.y += movementVector.getY();
			}
		}

		//stop player going out of bounds
		this.x = Math.max(0, this.x);
		this.x = Math.min(ctx.canvas.width, this.x);
		this.y = Math.max(0, this.y);
		this.y = Math.min(ctx.canvas.height, this.y);

		if (this.x == saveStartX && this.y == saveStartY) {
			this.isMoving = false;
		} else {
			this.isMoving = true;
		}

		var activeStatuses = [];
		for (var i = 0; i < this.statuses.length; i++) {
			this.statuses[i].update(dt);
			if (!this.statuses[i].isFinished()) {
				activeStatuses.push(this.statuses[i]);
			}
		}
		this.statuses = activeStatuses;

		var activeTotems = [];
		for (var i = 0; i < this.totems.length; i++) {
			this.totems[i].update(dt, this);
			if (this.totems[i].isAlive()) {
				activeTotems.push(this.totems[i]);
			}
		}
		this.totems = activeTotems;

		this.gcdCooldown = this.baseGcdCooldown * this.hasteMultiplier;

		if (this.isMoving) {
			if (this.skillToCast && this.castingTimer > 0) {
				this.gcdTracker = 0; //reset the GCD if a cast was interrupted
				this.stopCasting();
			}
		}

		if ((this.skillToCast && !(this.skillToCast.name == "Lightning Bolt")) || !this.skillToCast) {
			this.snapshotMaelstromStacks = Math.min(5, this.maelstromStacks);
		}

		if (this.gcdTracker > 0) {
			this.gcdTracker = Math.max(Math.min(this.gcdTracker - dt, this.gcdCooldown), 0);
		}

		$.each(this.skills, function(i,skill) {
			skill.update(dt, player, boss);
			if (skill.autoActivate && !this.skillToCast) {
				if (gameStarted && skill.inRange && !skill.onCooldown) {
					skill.activate(ctx, player, boss, projectiles, effects);
				}
			}
		});

		if (this.skillToCast) {
			if (this.castingTimer <= 0) {
				var skillActivated = this.skillToCast.activate(ctx, player, boss, projectiles, effects);
				if (skillActivated) {
					this.countSkillUse(this.skillToCast.name);
					if (this.skillToCast.shock) {
						$.each(this.skills, function(i,skill) {
							if (skill.shock && skill.name != skillActivated.name) {
								skill.cooldownActivated();
							}
						});
					}
					this.stopCasting();
				}
			} else {
				this.castingTimer -= dt;
				$(".skillCasting").removeClass("skillCasting");
				this.skillToCast.skillButtonElement.addClass("skillCasting");
			}
		}

		if (this.timeSinceLastDamage >= 0) {
			this.timeSinceLastDamage += dt;
			if (this.timeSinceLastDamage > this.timeBetweenDamageTicks) {
				this.timeSinceLastDamage = -1;
			}
		}
	}

	//draws player on canvas context passed to it
	draw(ctx) {
		ctx.save();
		//totems
		for (var i = 0; i < this.totems.length; i++) {
			this.totems[i].draw(ctx);
		}
		ctx.restore();

		ctx.save();

		//player
		ctx.beginPath();
		ctx.fillStyle = this.color;

		var tempRadius = this.radius;
		if (this.getStatus("Status_GhostWolf")) {
			tempRadius = tempRadius / 2;
		} else if (this.getStatus("Status_Ascendance")) {
			tempRadius = tempRadius * 1.3;
		}
		ctx.arc(this.x, this.y, tempRadius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.restore();

		ctx.save();
		if (this.timeSinceLastDamage >= 0) {
			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.arc(this.x, this.y, tempRadius/1.1, 0, 2 * Math.PI, true);
			ctx.fill();
		}
		ctx.restore();

		//stormbringer
		if (this.stormbringerBuff) {
			ctx.beginPath();
			ctx.strokeStyle = "aqua";
			ctx.arc(this.x, this.y, (this.radius) * 0.5, 0, 2 * Math.PI, true);
			ctx.stroke();
		}

		//casting visual
		var skillCastTime = 0;
		if (this.skillToCast) {
			skillCastTime = this.skillToCast.castTime;
		}
		if (skillCastTime > 0) {
			ctx.beginPath();
			ctx.fillStyle = this.castingColor;
			ctx.arc(this.x, this.y, (this.radius - 1) * ((skillCastTime - this.castingTimer) / skillCastTime), 0, 2 * Math.PI, true);
			ctx.fill();
		}

		//bloodlust
		if (this.getStatus("Status_Bloodlust")) {
			ctx.beginPath();
			ctx.strokeStyle = "purple";
			ctx.lineWidth = 2;
			ctx.arc(this.x, this.y, (this.radius) * 1.6, 0, 2 * Math.PI, true);
			ctx.stroke();
		}

		//feral spirit
		if (this.getStatus("Status_FeralSpirit")) {
			ctx.beginPath();
			ctx.strokeStyle = "yellow";
			ctx.lineWidth = 1;
			ctx.arc(this.x, this.y, (this.radius) * 0.8, 0, 2 * Math.PI, true);
			ctx.stroke();
		}

		//maelstrom stacks visual
		ctx.fillStyle = "orange";
		for (var i = 0; i < this.maelstromStacks; i++) {
			ctx.beginPath();
			var tempAngle = i * ((2*Math.PI) / this.maelstromStacks) - (Math.PI/2);
			ctx.arc(this.x + (this.radius * 0.8) * Math.cos(tempAngle), this.y + (this.radius * 0.8) * Math.sin(tempAngle), 3, 0, 2 * Math.PI, true);
			ctx.fill();
		}

		//doomwinds buff
		if (this.getStatus("Status_Doomwinds")) {
			ctx.beginPath();
			ctx.strokeStyle = "aqua";
			ctx.arc(this.x, this.y, (this.radius) * 2, 0, 2 * Math.PI, true);
			ctx.stroke();
		}
		ctx.restore();
	}
}
