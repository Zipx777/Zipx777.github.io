var canvas,
	ctx,
	player,
	boss,
	projectiles,
	effects,

	mouseX,
	mouseY,
	wasdKeys,

	gameOver,
	now,
	then,
	fpsInterval,
	startTime,
	timeElapsed,
	windowFocus,

	keybinds,
	skillButtons,

	skillSelectedID,
	skillSelectBuffer,
	skillSelectBufferTracker;

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

	gameOver = false;

	player = new Player(0.2 * ctx.canvas.width, 0.5 * ctx.canvas.height);
	boss = new Boss(new BossAttackSequence(), 0.5 * ctx.canvas.width, 0.3 * ctx.canvas.height);

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

	skillButtons = {};
	for (var i = 0; i < player.skills.length; i++) {
		skillButtons[player.skills[i].buttonId] = player.skills[i];
	}

	skillSelectedID = null;
	skillSelectBuffer = 0.5;
	skillSelectBufferTracker = 0;

	//set initial mouse position to the player so the player doesn't immediately start traveling somewhere
	mouseX = player.getX();
	mouseY = player.getY();

	wasdKeys = new Keys("wasd");

	windowFocus = true;

	timeElapsed = 0;
}

function setEventHandlers() {
	$("body").mousemove(raidAreaMouseMove);
	$("#wasdButton").click(wasdButtonClick);
	$("#mouseButton").click(mouseButtonClick);

	$(document).keydown(keyDownHandler);
	$(document).keyup(keyUpHandler);

	$(window).focus(function() {
		then = Date.now();
		windowFocus = true;
	});
	$(window).blur(function() {
		windowFocus = false;
	});
}

function raidAreaMouseMove(e) {
	var canvasElementOffset = $("#raidCanvas").offset();
	mouseX = e.pageX - canvasElementOffset.left;
	mouseY = e.pageY - canvasElementOffset.top;
}

function pressSkillButton(skillId) {
	player.attemptToActivateSkill(skillId);
}

function setSelectedSkill(skillID) {
	$(".skillSelected").removeClass("skillSelected");
	$("#" + skillID).addClass("skillSelected");
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

function populateResultsReport() {
	var totalDamage = 0;
	for (var key in boss.damageReport) {
		totalDamage += boss.damageReport[key];
	}
	var totalDps = totalDamage / boss.timeElapsed;
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
	$("#damageTakenResult").text(Math.floor(damageTaken));
	$("#damageTakenQuip").text(damageTakenQuip);

	//main stats bars
	//console.log("Auto Attack uptime: " + (player.autoAttackTotalUptime / boss.timeElapsed));
	//console.log("Maelstrom Stacks not wasted: " + ((player.maelstromStacksGenerated - player.maelstromStacksWasted) / player.maelstromStacksGenerated));
	//console.log("Flame Shock uptime: " + (player.flameShockTotalUptime / boss.timeElapsed));

	var autoAttackUptime = player.autoAttackTotalUptime / boss.timeElapsed;
	var maelstromStacksNotWasted = (Math.max(player.maelstromStacksGenerated, 1) - player.maelstromStacksWasted) / Math.max(player.maelstromStacksGenerated, 1);
	var flameShockUptime = player.flameShockTotalUptime / boss.timeElapsed;
	var statsArray = {
		"Auto Attack uptime": autoAttackUptime,
		"Maelstrom gained": maelstromStacksNotWasted,
		"Flame Shock uptime": flameShockUptime
	};

	for (var stat in statsArray) {
		var statTrackRowElement = $(document.createElement("tr"));
		var statTrackNameElement = $(document.createElement("td"));
		statTrackNameElement.addClass("statTrackerNameCell");
		statTrackNameElement.text(stat);
		var statTrackNumberElement = $(document.createElement("td"));
		statTrackNumberElement.addClass("statTrackerNumberCell");
		var prettyNumber = (Math.floor(statsArray[stat] * 1000)) / 10;
		statTrackNumberElement.text(prettyNumber + " %");
		var statTrackBarContainerElement = $(document.createElement("td"));
		statTrackBarContainerElement.addClass("statTrackerBarCell");
		var statTrackBarElement = $(document.createElement("div"));
		statTrackBarElement.addClass("statTrackerBar");
		if (statsArray[stat] >= 0.95) {
			statTrackBarElement.css("background-color", "lime");
		} else if (statsArray[stat] >= 0.9) {
			statTrackBarElement.css("background-color", "green");
		} else if (statsArray[stat] >= 0.8) {
			statTrackBarElement.css("background-color", "orange");
		} else {
			statTrackBarElement.css("background-color", "firebrick");
		}
		var statTrackBarWidth = statsArray[stat] * 350;
		statTrackBarElement.width(Math.max(1, statTrackBarWidth));
		statTrackBarContainerElement.append(statTrackBarElement);
		statTrackRowElement.append(statTrackNameElement);
		statTrackRowElement.append(statTrackNumberElement);
		statTrackRowElement.append(statTrackBarContainerElement);

		$("#statTrackers").append(statTrackRowElement);
	}

	//damage breakdown
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
	if (elapsed > 0 && windowFocus) { //>= fpsInterval) {
		then = now;// - (elapsed % fpsInterval);

		update(elapsed / 1000); //dt passed in seconds, average of about 0.016 for 60fps

		draw();

	}
}

//check for projectile hitting stuff
function checkProjForCollisions(proj) {
	var collisionHappened = false;

	//check projectile versus boss
	if (collisionCheck(proj, boss)) {
		collisionHappened = true;
		//proj.parent = boss;
		boss.handleHitByProjectile(proj);

		player.handleProjectileImpactLogic(proj);
	}

	return collisionHappened;
}

//update player and object states
function update(dt) {
	//show results info
	if ((!boss.isAlive() || !player.isAlive()) && !gameOver) {
		gameOver = true;
		populateResultsReport();
	}

	if (gameOver) {
		return;
	}

	player.update(dt, mouseX, mouseY, wasdKeys, player, boss, ctx);
	boss.update(dt, player, boss, ctx);

	if (skillSelectedID) {
		pressSkillButton(skillSelectedID);
		skillSelectBufferTracker -= dt;
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
			projectiles[i].update(dt, boss);

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
		effect.update(dt);
		if (effect.isAlive()) {
			activeEffects.push(effect);
		}
	});
	effects = activeEffects;

	timeElapsed += dt;
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
	player.draw(ctx);

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

	if (!boss.isAlive()) { //You Win!
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
	} else if (!player.isAlive()) { //You Lose :(
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
