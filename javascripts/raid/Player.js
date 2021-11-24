//Player class
class Player {
	constructor(startX, startY) {
		this.x = startX;
		this.y = startY;
		this.speed = 2;
		this.color = "blue";
		this.gcdColor = "white";
		this.castingColor = "aqua";
		this.radius = 15;
		this.hitboxRadiusPercent = 0.5;
		this.isMoving = false;

		this.maxMana = 100;
		this.currentMana = 100;
		this.manaRegenPerTick = 0.01;

		this.totems = [];
		this.statuses = [];
		this.maelstromStacks = 0;
		this.snapshotMaelstromStacks = 0; //how many stacks were there when lightning bolt started casting

		this.baseHasteMultiplier = 0.8; //save base haste
		this.hasteMultiplier = 0.8; //speeds up auto attack and melee cooldowns

		this.stormbringerBuff = false;

		this.explosionSFXFilePath = "sounds/turrets/playerDeath.wav";
		this.explosionSFXVolume = 1;

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

	//update Player position and skills
	update(targetX, targetY, keys, ctx) {
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

		//update movement
		if (this.controlMode == 1) {
			var vectorTowardsMouse = new Vector(targetX - this.x, targetY - this.y);
			if (vectorTowardsMouse.length() > this.speed) {
				vectorTowardsMouse = vectorTowardsMouse.normalize().multiply(currentSpeed);
			}

			this.x += vectorTowardsMouse.getX();
			this.y += vectorTowardsMouse.getY();

			//clamp position to within the canvas bounds
			this.x = Math.max(this.x, 0);
			this.y = Math.max(this.y, 0);
			this.x = Math.min(this.x, ctx.canvas.width);
			this.y = Math.min(this.y, ctx.canvas.height);
		} else if (this.controlMode == 2) {
			var movementVector = new Vector(0,0);
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
				movementVector = movementVector.normalize().multiply(currentSpeed);

				this.x += movementVector.getX();
				this.y += movementVector.getY();

				//stop player going out of bounds
				this.x = Math.max(0, this.x);
				this.x = Math.min(ctx.canvas.width, this.x);
				this.y = Math.max(0, this.y);
				this.y = Math.min(ctx.canvas.height, this.y);
			}
		}

		if (this.x == saveStartX && this.y == saveStartY) {
			this.isMoving = false;
		} else {
			this.isMoving = true;
		}

		var activeStatuses = [];
		for (var i = 0; i < this.statuses.length; i++) {
			this.statuses[i].update();
			if (!this.statuses[i].isFinished()) {
				activeStatuses.push(this.statuses[i]);
			}
		}
		this.statuses = activeStatuses;

		var activeTotems = [];
		for (var i = 0; i < this.totems.length; i++) {
			this.totems[i].update(this);
			if (this.totems[i].isAlive()) {
				activeTotems.push(this.totems[i]);
			}
		}
		this.totems = activeTotems;
	}

	//draws player on canvas context passed to it
	draw(ctx, gcdCooldown, gcdTracker, skillCastTime, castingTime) {
		//totems
		for (var i = 0; i < this.totems.length; i++) {
			this.totems[i].draw(ctx);
		}

		//player
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		var tempRadius = this.radius;
		if (this.getStatus("Status_GhostWolf")) {
			tempRadius = tempRadius / 2;
		} else if (this.getStatus("Status_Ascendance")) {
			tempRadius = tempRadius * 1.5;
		}
		ctx.arc(this.x, this.y, tempRadius, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.restore();

		//gcd
		if (gcdTracker > 0) {
			ctx.save();
			/*
			//circle line sweep down clockwise
			ctx.strokeStyle = this.gcdColor;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius - 3, -1 * Math.PI/2, 2 * Math.PI * ((gcdCooldown - gcdTracker) / gcdCooldown) - Math.PI/2, true);
			ctx.stroke();
			*/

			//circle grow from center
			ctx.strokeStyle = this.gcdColor;
			ctx.globalAlpha = Math.min(1, Math.max(0, (gcdTracker / gcdCooldown)));
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius) * ((gcdCooldown - gcdTracker) / gcdCooldown), 0, 2 * Math.PI, true);
			ctx.stroke();
			ctx.restore();
		}

		//casting visual
		if (skillCastTime > 0) {
			ctx.save();
			ctx.fillStyle = this.castingColor;
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius - 1) * ((skillCastTime - castingTime) / skillCastTime), 0, 2 * Math.PI, true);
			ctx.fill();
			ctx.restore();
		}

		//bloodlust
		if (this.getStatus("Status_Bloodlust")) {
			ctx.save();
			ctx.strokeStyle = "red";
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius) * 1.5, 0, 2 * Math.PI, true);
			ctx.stroke();
			ctx.restore();
		}

		//maelstrom stacks visual
		ctx.save();
		ctx.fillStyle = "orange";
		for (var i = 0; i < this.maelstromStacks; i++) {
			ctx.beginPath();
			var tempAngle = i * ((2*Math.PI) / this.maelstromStacks) - (Math.PI/2);
			ctx.arc(this.x + (this.radius * 0.8) * Math.cos(tempAngle), this.y + (this.radius - 1) * Math.sin(tempAngle), 2, 0, 2 * Math.PI, true);
			ctx.fill();
		}
		ctx.restore();

		//doomwinds buff
		if (this.getStatus("Status_Doomwinds")) {
			ctx.save();
			ctx.strokeStyle = "aqua";
			ctx.beginPath();
			ctx.arc(this.x, this.y, (this.radius) * 2, 0, 2 * Math.PI, true);
			ctx.stroke();
			ctx.restore();
		}
	}
}
