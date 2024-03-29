var canvas,
	ctx,
	tickCount,
	player,
	freeze,
	turrets,
	projectiles,
	effects,
	turret,
	turretTwo,
	turretTypes,
	turretSpawnDelay,
	minTurretSpawnDelay,
	turretSpawnDelayAccel,
	turretLastSpawnedTick,
	mouseX,
	mouseY,
	wasdKeys,
	sounds,
	score,
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
	canvas = $("#turretCanvas");
	ctx = canvas[0].getContext("2d");

	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();

	//have to set height/width attributes to avoid weird canvas scaling issue
	//height and width set in the .css for #turretArea
	canvas.attr("width", canvasWidth).attr("height", canvasHeight);

	var xPos = 0.5 * ctx.canvas.width;
	var yPos = 0.5 * ctx.canvas.height;

	tickCount = 0;
	turretLastSpawnedTick = 0;

	player = new Player(0.2 * ctx.canvas.width, 0.5 * ctx.canvas.height);

	turretone = new Turret(xPos - 50, yPos, new Vector(1,0));
	turrettwo = new Turret_Homing(xPos + 50, yPos, new Vector(1,0));
	turretthree = new Turret_Shotgun(xPos + 150, yPos, new Vector(1,0));

	turretTypes = [];
	turretTypes.push(Turret);
	turretTypes.push(Turret_Homing);
	turretTypes.push(Turret_Shotgun);

	turretSpawnDelay = 120;
	turretSpawnDelayAccel = 0.99;
	minTurretSpawnDelay = 15;

	freeze = false;

	//set initial mouse position to the player so the player doesn't immediately start traveling somewhere
	mouseX = player.getX();
	mouseY = player.getY();

	wasdKeys = new Keys("wasd");

	turrets = [];
	turrets.push(turretone);
	//turrets.push(turrettwo);
	//turrets.push(turretthree);

	projectiles = [];

	effects = [];

	sounds = [];
	//var expSFX = new Audio("sounds/turrets/explosion.mp3");
	//sounds.push(expSFX);

	score = 0;
}

function setEventHandlers() {
	$("#turretArea").click(turretAreaClick);
	$("body").mousemove(turretAreaMouseMove);
	$("#wasdButton").click(wasdButtonClick);
	$("#mouseButton").click(mouseButtonClick);

	$(document).keydown(keyDownHandler);
	$(document).keyup(keyUpHandler);
}

function turretAreaMouseMove(e) {
	var canvasElementOffset = $("#turretCanvas").offset();
	mouseX = e.pageX - canvasElementOffset.left;
	mouseY = e.pageY - canvasElementOffset.top;
}

//handler when a key is pressed
function keyDownHandler(e) {
	wasdKeys.onKeyDown(e);
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

function checkForCollisions(proj) {
	var collisionHappened = false;

	//check vs player
	if (collisionCheck(proj, player)) {
		collisionHappened = true;
		playerTookDamage();
	}

	//check vs turrets
	for (var i = 0; i < turrets.length; i++) {
		if (collisionCheck(proj, turrets[i])) {
			collisionHappened = true;
			turrets[i].takeDamage();
		}
	}

	//check vs effects
	for (var i = 0; i < effects.length; i++) {
		if (effects[i].getDoesDamage()) {
			if (collisionCheck(proj, effects[i])) {
				collisionHappened = true;
			}
		}
	}

	return collisionHappened;
}

function checkForTurretOverlap(newTurret) {
	for (var i = 0; i < turrets.length; i++) {
		if (collisionCheck(turrets[i], newTurret)) {
			return true;
		}
	}
	return false;
}

//trigger a new turret to spawn somewhere
function spawnNewRandomTurret() {
	var borderMargin = 10;
	var randTurretType = turretTypes[Math.floor(Math.random() * turretTypes.length)];
	var newTurret = new randTurretType(0, 0);
	var spawnAttempts = 0;
	var randX = 0;
	var randY = 0;
	do {
		//quick brute force attempt to not spawn turrets overlapping
		randX = Math.random() * (ctx.canvas.width - 2*borderMargin) + borderMargin;
		randY = Math.random() * (ctx.canvas.height - 2*borderMargin) + borderMargin;
		newTurret.setX(randX);
		newTurret.setY(randY);
		spawnAttempts++;
	}
	while (checkForTurretOverlap(newTurret) && spawnAttempts < 10);
	//turrets.push(newTurret);
	var turretSpawnEffect = newTurret.getSpawnEffect();
	turretSpawnEffect.turretToSpawn = newTurret;
	turretSpawnEffect.setX(randX);
	turretSpawnEffect.setY(randY);
	turretSpawnEffect.setRadius(newTurret.getRadius());
	//turretSpawnEffect.setColor(newTurret.getColor())
	effects.push(turretSpawnEffect);

	turretLastSpawnedTick = tickCount;
}

function cleanUpDeadObjects() {

	//clean up turrets and update score for dead ones
	var activeTurrets = [];
	for (var i = 0; i < turrets.length; i++) {
		if (turrets[i].isAlive()) {
			activeTurrets.push(turrets[i]);
		} else {
			score++;
		}
	}
	turrets = activeTurrets;

	//clean up projectiles
	var activeProjectiles = [];
	for (var i = 0; i < projectiles.length; i++) {
		if (projectiles[i].isAlive()) {
			activeProjectiles.push(projectiles[i]);
		}
	}
	projectiles = activeProjectiles;

	//clean up effects
	var activeEffects = [];
	for (var i = 0; i < effects.length; i++) {
		if (effects[i].isAlive()) {
			activeEffects.push(effects[i]);
		} else {
			if (effects[i].getTurretToSpawn() != null) {
				turrets.push(effects[i].getTurretToSpawn());
			}
		}
	}
	effects = activeEffects;
}

function turretAreaClick() {
	//var expSFX = new Audio("sounds/turrets/explosion.mp3");
	//expSFX.play();
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
	if (true || elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);

		update();

		draw();

	}
}

//update player and turret states
function update() {
	if (freeze) {
		return;
	}

	//update player
	player.update(mouseX, mouseY, wasdKeys, ctx);

	//update turrets
	for (var i = 0; i < turrets.length; i++) {
		turrets[i].update(player.getX(), player.getY(), projectiles);
		if (collisionCheck(player, turrets[i])) {
			turrets[i].explode();
			playerTookDamage();
		}
	}

	//see if it's time for a new turret
	if (tickCount - turretLastSpawnedTick > turretSpawnDelay) {
		spawnNewRandomTurret();
		turretSpawnDelay = Math.max(turretSpawnDelay * turretSpawnDelayAccel, minTurretSpawnDelay);
	}

	//update projectiles
	var activeProjectiles = [];
	for (var i = 0; i < projectiles.length; i++) {
		if (projectiles[i].isInBounds()) {
			projectiles[i].update(player);

			if (checkForCollisions(projectiles[i])) {
					projectiles[i].explode();
			} else {
					activeProjectiles.push(projectiles[i]);
			}
		} else {
			projectiles[i].explode();
		}
	}
	projectiles = activeProjectiles;

	//update effects
	for (var i = 0; i < effects.length; i++) {
		effects[i].update();
	}

	cleanUpDeadObjects();

	//update score
	$("#scoreValue").text(score);
	tickCount++;
}

//draw player and turret
function draw() {
	//clear the board
	ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

	//draw the player
	player.draw(ctx);

	//draw the turrets
	$.each(turrets, function(i,turr) {
		turr.draw(ctx);
	});

	//draw the projectiles
	$.each(projectiles, function(i,proj) {
		proj.draw(ctx);
	});

	//draw the effects
	//make sure damaging effects are on top
	var damagingEffects = [];
	$.each(effects, function(i,eff) {
		if (eff.getDoesDamage()) {
			damagingEffects.push(eff);
		} else {
			eff.draw(ctx);
		}
	});

	$.each(damagingEffects, function(i,eff) {
		eff.draw(ctx);
	});
}
