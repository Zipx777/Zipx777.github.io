var canvas,
	ctx,
	tickCount,
	player,
	keybinds,
	skillButtons,
	skills,
	skillSelectedID,
	skillSelectBuffer,
	skillSelectBufferTracker,
	skillToCast,
	castingTimer,
	projectiles,
	effects,
	baseGcdCooldown,
	gcdCooldown,
	gcdTracker,
	boss,
	freeze,
	mouseX,
	mouseY,
	wasdKeys,
	sounds,
	score,
	gameOver,
	now,
	then,
	fpsInterval,
	startTime;

//document ready function
$(function() {
	initializeVariables();

	setEventHandlers();

	startAnimating();
});

function initializeVariables() {
	canvas = $("#raidCanvas");
	ctx = canvas[0].getContext("2d");

	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	//have to set height/width attributes to avoid weird canvas scaling issue
	//height and width set in the .css for #raidArea
	canvas.attr("width", canvasWidth).attr("height", canvasHeight);

	tickCount = 0;
	gameOver = false;

	projectiles = [];
	effects = [];

	keybinds = {
		69: "eSkill",
		81: "qSkill",
		49: "oneSkill",
		50: "twoSkill",
		51: "threeSkill",
		52: "fourSkill",
		86: "vSkill",
		90: "zSkill",
		53: "fiveSkill",
		67: "cSkill",
		71: "gSkill",
		88: "xSkill",
		70: "fSkill",
		82: "rSkill"
	};

	skills = [
		new Skill_StormStrike("eSkill"),
		new Skill_LightningBolt("qSkill"),
		new Skill_LavaLash("oneSkill"),
		new Skill_FrostShock("twoSkill"),
		new Skill_FlameShock("threeSkill"),
		new Skill_CrashLightning("fourSkill"),

		new Skill_Bloodlust("zSkill"),
		new Skill_Ascendance("xSkill"),
		new Skill_FeralSpirit("vSkill"),
		new Skill_WindfuryTotem("rSkill"),
		new Skill_Sundering("fSkill"),

		new Skill_SpiritWalk("cSkill"),
		new Skill_GhostWolf("fiveSkill"),

		new Skill_HealingSurge("gSkill"),
		new Skill_AutoAttack(),
		new Skill_WindfuryWeapon()
	];

	skillButtons = {};
	for (var i = 0; i < skills.length; i++) {
		skillButtons[skills[i].buttonId] = skills[i];
	}

	baseGcdCooldown = 90;
	gcdCooldown = 90;
	gcdTracker = 0;

	skillSelectedID = null;
	skillSelectBuffer = 30;
	skillSelectBufferTracker = 0;

	casting = false;
	castingTimer = 0;

	player = new Player(0.2 * ctx.canvas.width, 0.5 * ctx.canvas.height);
	boss = new Boss(new BossAttackSequence(), 0.5 * ctx.canvas.width, 0.3 * ctx.canvas.height);

	freeze = false;

	//set initial mouse position to the player so the player doesn't immediately start traveling somewhere
	mouseX = player.getX();
	mouseY = player.getY();

	wasdKeys = new Keys("wasd");
}

function setEventHandlers() {
	$("#raidArea").click(raidAreaClick);
	$("body").mousemove(raidAreaMouseMove);
	$("#wasdButton").click(wasdButtonClick);
	$("#mouseButton").click(mouseButtonClick);

	$(document).keydown(keyDownHandler);
	$(document).keyup(keyUpHandler);
}

function raidAreaMouseMove(e) {
	var canvasElementOffset = $("#raidCanvas").offset();
	mouseX = e.pageX - canvasElementOffset.left;
	mouseY = e.pageY - canvasElementOffset.top;
}

function pressSkillButton(skillId) {
	if (gcdTracker <= 0) {
		var skillToActivate = skillButtons[skillId];
		if (skillToActivate.readyToActivate() && !(player.isMoving && skillToActivate.castTime > 0) && !skillToCast) {
			castingTimer = skillToActivate.castTime;
			skillToCast = skillToActivate;
			if (skillToActivate.playerStatusToApply != Status_GhostWolf && skillToActivate.name != "Spirit Walk") {
				player.removeStatus("Status_GhostWolf");
			}
			if (skillToCast.name == "Lightning Bolt") {
				player.snapshotMaelstromStacks = Math.min(5, player.maelstromStacks);
			}

			gcdTracker = gcdCooldown;
			skillSelectedID = null;
			skillSelectBufferTracker = 0;
			$(".skillSelected").removeClass("skillSelected");
		}
	}
}

function setSelectedSkill(skillID) {
	$(".skillSelected").removeClass("skillSelected");
	$("#" + skillID).addClass("skillSelected");
}

function stopCasting() {
	skillToCast = null;
	castingTimer = 0; //should be unnecessary
	$(".skillCasting").removeClass("skillCasting");
}

//handler when a key is pressed
function keyDownHandler(e) {
	wasdKeys.onKeyDown(e);
	//console.log(e.which);
	var keycode = e.which;
	//e = 69, q = 81

	var tempKeys = Object.keys(keybinds);

	for (var i = 0; i < tempKeys.length; i++) {
		if (tempKeys[i] == keycode) {
			skillSelectedID = keybinds[keycode];
			skillSelectBufferTracker = skillSelectBuffer;
			setSelectedSkill(skillSelectedID);
		}
	}
}

//handler for when a key is released
function keyUpHandler(e) {
	wasdKeys.onKeyUp(e);
}

function mouseButtonClick() {
	player.setControlMode(1);
}

function wasdButtonClick() {
	player.setControlMode(2);
}

function playerTookDamage() {
	player.takeDamage();
	freeze = true;
}

function collisionCheck(target1, target2) {
	var xDistBetween = target1.getX() - target2.getX();
	var yDistBetween = target1.getY() - target2.getY();
	var distBetweenSquared = Math.pow(xDistBetween, 2) + Math.pow(yDistBetween, 2);
	var combinedRadiiSquared = Math.pow(target1.getHitboxRadius(), 2) + Math.pow(target2.getHitboxRadius(), 2);
	if (distBetweenSquared <= combinedRadiiSquared) {
		return true;
	} else {
		return false;
	}
}

function raidAreaClick() {
	//var expSFX = new Audio("sounds/raids/explosion.mp3");
	//expSFX.play();
}

function populateResultsReport() {
	var totalDamage = 0;
	for (var key in boss.damageReport) {
		totalDamage += boss.damageReport[key];
	}
	var totalDps = totalDamage / (boss.tickCount / 60);
	var damageTaken = player.maxHealth - player.currentHealth;
	var damageTakenQuip = "Umm healers? Hello?!";
	if (damageTaken == 0) {
		damageTakenQuip = "Flawless! Exemplary raider, Matt and Chris are so happy.";
	} else if (damageTaken < 0.05 * player.maxHealth) {
		damageTakenQuip = "That hit me?!";
	} else if (damageTaken < 0.25 * player.maxHealth) {
		damageTakenQuip = "The healers love you.";
	} else if (damageTaken < 0.5 * player.maxHealth) {
		damageTakenQuip = "The healers are slightly concerned.";
	} else if (damageTaken < 0.75 * player.maxHealth) {
		damageTakenQuip = "The healers are very mad.";
	} else if (damageTaken < player.maxHealth) {
		damageTakenQuip = "Chris, I'm taking this. And this. And this. And that one too.";
	}
	$("#overallDpsResult").text(Math.floor(totalDps));
	$("#damageTakenResult").text(damageTaken);
	$("#damageTakenQuip").text(damageTakenQuip);
	var nextKey = "";
	var nextDamage = 0;
	var maxDamage = 0;
	var continuing = true;
	while (continuing) {
		for (var key in boss.damageReport) {
			if (boss.damageReport[key] > nextDamage) {
				nextDamage = boss.damageReport[key];
				nextKey = key;
			}
		}
		if (maxDamage == 0) {
			maxDamage = nextDamage;
		}
		if (nextDamage == 0) {
			continuing = false;
		} else {
			var barWidth = (nextDamage / maxDamage) * 320;
			console.log(barWidth);
			var nextRowElement = $(document.createElement("tr"));
			var skillNameElement = $(document.createElement("td"));
			skillNameElement.text(nextKey);
			var skillDamageElement = $(document.createElement("td"));
			skillDamageElement.text(Math.floor(nextDamage));
			var skillDamageBarContainerElement = $(document.createElement("td"));
			var skillDamageBarElement = $(document.createElement("div"));
			skillDamageBarElement.addClass("damageBreakdownBar");
			skillDamageBarElement.width(Math.max(1, barWidth));
			skillDamageBarContainerElement.append(skillDamageBarElement);
			nextRowElement.append(skillNameElement);
			nextRowElement.append(skillDamageElement);
			nextRowElement.append(skillDamageBarContainerElement);
			//$("#damageBreakdown").append("<tr><td>" + nextKey + "</td><td>" + Math.floor(boss.damageReport[nextKey]) + "</td><td><div class=\"damageBreakdownBar\" width=\"10px\"></div></td></tr>");
			$("#damageBreakdown").append(nextRowElement);
			boss.damageReport[nextKey] = 0;
			nextDamage = 0;
		}
	}
	$("#resultsReport").show();
}

function startAnimating() {
	fpsInterval = 1000 / 59;
  then = Date.now();
  startTime = then;
  animate();
}

//***************
//main game loop
//***************
function animate() {

	window.requestAnimFrame(animate);

	now = Date.now();
	elapsed = now - then;
	if (elapsed >= fpsInterval) {
		then = now - (elapsed % fpsInterval);

		update();

		draw();

	}
}

//check for projectile hitting stuff
function checkProjForCollisions(proj) {
	var collisionHappened = false;

	//check projectile versus boss
	if (collisionCheck(proj, boss)) {
		collisionHappened = true;
		proj.parent = boss;
		boss.handleHitByProjectile(proj);
		if (proj.isMelee) {
			//stormbringer
			var stormbringerChance = 0.05;
			if (proj.skillOrigin != "Auto Attack") {
				if (Math.random() <= stormbringerChance) {
					for (var i = 0; i < skills.length; i++) {
						if (skills[i].name == "Storm Strike") {
							skills[i].resetCooldown();
							skills[i].skillButtonElement.removeClass("skillProced");
							skills[i].skillButtonElement.addClass("skillProcced");
							player.stormbringerBuff = true;
							console.log("Stormbringer proc");
						}
					}
				}
			}

			//windfury weapon
			var windfuryChance = 0.2;
			var doomwindsStatus = player.getStatus("Status_Doomwinds");
			if (doomwindsStatus) {
				windfuryChance = doomwindsStatus.doomwindsWindfuryChance;
			}
			if (proj.skillOrigin != "Windfury Weapon") {
				if (Math.random() <= windfuryChance) {
					var tempSkillReference = null;
					for (var i = 0; i < skills.length; i++) {
						if (skills[i].name == "Windfury Weapon") {
							tempSkillReference = skills[i];
						}
					}
					tempSkillReference.activate(ctx, player, boss, projectiles);
				}
			}


			//maelstrom
			var maelstromChance = 0.2;
			if (Math.random() <= maelstromChance) {
				player.addMaelstromStack();
			}
		}
	}

	return collisionHappened;
}

//update player and object states
function update() {
	//show results info
	if ((!boss.isAlive() || !player.isAlive()) && !gameOver) {
		gameOver = true;
		populateResultsReport();
	}

	if (gameOver) {
		return;
	}

	player.update(mouseX, mouseY, wasdKeys, ctx);
	boss.update(player, boss, ctx);

	this.gcdCooldown = this.baseGcdCooldown * player.hasteMultiplier;

	if (player.isMoving) {
		if (skillToCast && castingTimer > 0) {
			gcdTracker = 0; //reset the GCD if a cast was interrupted
			stopCasting();
		}
	}

	if ((skillToCast && !(skillToCast.name == "Lightning Bolt")) || !skillToCast) {
		player.snapshotMaelstromStacks = Math.min(5, player.maelstromStacks);
	}



	if (gcdTracker > 0) {
		gcdTracker = Math.min(gcdTracker - 1, gcdCooldown);
		$("#gcdDisplay").text(gcdTracker);
	}

	$.each(skills, function(i,skill) {
		skill.update(player, boss);
		if (skill.autoActivate && !skillToCast) {
			if (skill.inRange && !skill.onCooldown) {
				skill.activate(ctx, player, boss, projectiles);
			}
		}
	});

	if (skillToCast) {
		if (castingTimer <= 0) {
			var skillActivated = skillToCast.activate(ctx, player, boss, projectiles);
			if (skillActivated) {
				if (skillToCast.shock) {
					$.each(skills, function(i,skill) {
						if (skill.shock && skill.name != skillToCast.name) {
							skill.cooldownActivated();
						}
					});
				}
				stopCasting();
			}
		} else {
			castingTimer--;
			$(".skillCasting").removeClass("skillCasting");
			skillToCast.skillButtonElement.addClass("skillCasting");
		}
	}

	if (skillSelectedID) {
		pressSkillButton(skillSelectedID);
		skillSelectBufferTracker--;
		if (skillSelectBufferTracker <= 0) {
			skillSelectedID = null;
			skillSelectBufferTracker = 0;
			$(".skillSelected").removeClass("skillSelected");
		}
	}

	//update projectiles
	var activeProjectiles = [];
	for (var i = 0; i < projectiles.length; i++) {
		if (projectiles[i].isInBounds()) {
			projectiles[i].update(boss);

			if (checkProjForCollisions(projectiles[i])) {
					projectiles[i].explode(effects);
			} else {
					activeProjectiles.push(projectiles[i]);
			}
		} else {
			projectiles[i].explode(effects);
		}
	}
	projectiles = activeProjectiles;

	var activeEffects = [];
	$.each(effects, function(i,effect) {
		effect.update();
		if (effect.isAlive()) {
			activeEffects.push(effect);
		}
	});
	effects = activeEffects;

	tickCount++;
}

//draw player and raid
function draw() {
	ctx.save();
	//clear the board
	ctx.fillStyle = "lightgray";
	ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

	//draw the Boss
	boss.draw(ctx);

	//draw the player
	var skillCastTime = 0;
	if (skillToCast) {
		skillCastTime = skillToCast.castTime;
	}
	player.draw(ctx, gcdCooldown, gcdTracker, skillCastTime, castingTimer);

	$.each(projectiles, function(i, proj) {
		proj.draw(ctx);
	});

	$.each(effects, function(i, effect) {
		effect.draw(ctx);
	});

	//boss health bar
	if (boss.fightStarted) {
		ctx.beginPath();
		ctx.rect(20,15,Math.max(0,560 * (boss.currentHealth / boss.maxHealth)),10);
		ctx.fillStyle = "red";
		ctx.fill();

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.rect(20,15,560,10);
		ctx.stroke();
	}

	//player health bar
	ctx.beginPath();
	ctx.rect(20,ctx.canvas.height - 15,Math.max(0,560 * (player.currentHealth / player.maxHealth)),10);
	ctx.fillStyle = "blue";
	if (player.currentHealth < player.maxHealth) {
		ctx.fillStyle = "green";
	}
	if (player.currentHealth / player.maxHealth < 0.75) {
		ctx.fillStyle = "gold";
	}
	if (player.currentHealth / player.maxHealth < 0.5) {
		ctx.fillStyle = "orange";
	}
	if (player.currentHealth / player.maxHealth < 0.25) {
		ctx.fillStyle = "red";
	}
	ctx.fill();

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	ctx.rect(20,ctx.canvas.height - 15,560,10);
	ctx.stroke();

	if (!boss.isAlive()) {
		ctx.save();
		ctx.font = '100px serif';
		ctx.textAlign = "center";
		ctx.shadowColor="black";
		ctx.shadowBlur=1;
		ctx.lineWidth=3;
		ctx.strokeText("You Win!", ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.shadowBlur=0;
		ctx.fillStyle = "orange";
		ctx.fillText("You Win!", ctx.canvas.width / 2, ctx.canvas.height / 2);
	} else if (!player.isAlive()) {
		ctx.font = '100px serif';
		ctx.textAlign = "center";
		ctx.shadowColor="black";
		ctx.shadowBlur=1;
		ctx.lineWidth=3;
		ctx.strokeText("You Died :(", ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.shadowBlur=0;
		ctx.fillStyle = "red";
		ctx.fillText("You Died :(", ctx.canvas.width / 2, ctx.canvas.height / 2);
	}

	if (gameOver) {
		ctx.font = '48px serif';
		ctx.fillStyle = "black";
		ctx.fillText("↡ Results below ↡", ctx.canvas.width / 2, (ctx.canvas.height/2) + 50);
		ctx.restore();
	}

	ctx.restore();
}
