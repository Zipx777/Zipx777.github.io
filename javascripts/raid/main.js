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
	gcdCooldown,
	gcdTracker,
	boss,
	freeze,
	mouseX,
	mouseY,
	wasdKeys,
	sounds,
	score;

//document ready function
$(function() {
	initializeVariables();

	setEventHandlers();

	animate();
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

	projectiles = [];
	effects = [];

	keybinds = {
		69: "eSkill",
		81: "qSkill",
		49: "oneSkill",
		50: "twoSkill",
		51: "threeSkill",
		52: "fourSkill"
	};

	skills = [
		new Skill_AutoAttack(),
		new Skill_StormStrike("eSkill"),
		new Skill_LavaLash("qSkill"),
		new Skill_LightningBolt("oneSkill"),
		new Skill_FrostShock("twoSkill"),
		new Skill_FlameShock("threeSkill"),
		new Skill_CrashLightning("fourSkill"),
		new Skill_Windfury()
	];

	skillButtons = {
		"eSkill": skills[1],
		"qSkill": skills[2],
		"oneSkill": skills[3],
		"twoSkill": skills[4],
		"threeSkill": skills[5],
		"fourSkill": skills[6]
	};

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

//***************
//main game loop
//***************
function animate() {

	update();

	draw();

	window.requestAnimFrame(animate);
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

			//windfury
			var windfuryChance = 0.2;
			if (Math.random() <= windfuryChance) {
				var tempSkillReference = null;
				for (var i = 0; i < skills.length; i++) {
					if (skills[i].name == "Windfury") {
						tempSkillReference = skills[i];
					}
				}

				tempSkillReference.activate(ctx, player, boss, projectiles);
			}

			//maelstrom
			var maelstromChance = 0.2;
			if (Math.random() <= maelstromChance) {
				player.maelstromStacks = Math.min(10, player.maelstromStacks + 1);
				console.log("Maelstrom Stacks: " + player.maelstromStacks);
			}
		}
	}

	return collisionHappened;
}

//update player and object states
function update() {
	if (freeze) {
		return;
	}

	player.update(mouseX, mouseY, wasdKeys, ctx);
	boss.update(player.getX(), player.getY(), ctx);

	if (player.isMoving) {
		if (skillToCast) {
			gcdTracker = 0; //reset the GCD if a cast was interrupted
			stopCasting();
		}
	}

	if ((skillToCast && !(skillToCast.name == "Lightning Bolt")) || !skillToCast) {
		player.snapshotMaelstromStacks = Math.min(5, player.maelstromStacks);
	}

	$.each(skills, function(i,skill) {
		skill.update(player, boss);
		if (skill.autoActivate && !skillToCast) {
			if (skill.inRange && !skill.onCooldown) {
				skill.activate(ctx, player, boss, projectiles);
			}
		}
	});

	if (gcdTracker > 0) {
		gcdTracker--;
		$("#gcdDisplay").text(gcdTracker);
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

	if (skillToCast) {
		if (castingTimer <= 0) {
			skillToCast.activate(ctx, player, boss, projectiles);
			if (skillToCast.shock) {
				$.each(skills, function(i,skill) {
					if (skill.shock && skill.name != skillToCast.name) {
						skill.cooldownActivated();
					}
				});
			}
			stopCasting();
		} else {
			castingTimer--;
			$(".skillCasting").removeClass("skillCasting");
			skillToCast.skillButtonElement.addClass("skillCasting");
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
	//clear the board
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
}
