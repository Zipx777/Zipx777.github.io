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
	turretSpawnDelayAccel,
	turretLastSpawnedTick,
	mouseX,
	mouseY,
	score;

//document ready function
$(function() {
	initializeVariables();

	setEventHandlers();

	animate();
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

	turretone = new Turret(xPos - 50, yPos);
	turrettwo = new Turret_Homing(xPos + 50, yPos);

	turretTypes = [];
	turretTypes.push(Turret);
	turretTypes.push(Turret_Homing);

	turretSpawnDelay = 120;
	turretSpawnDelayAccel = 0.99;

	freeze = false;

	//set initial mouse position to the player so the player doesn't immediately start traveling somewhere
	mouseX = player.getX();
	mouseY = player.getY();

	turrets = [];
	turrets.push(turretone);
	turrets.push(turrettwo);

	projectiles = [];

	effects = [];

	score = 0;
}

function setEventHandlers() {
	$("#turretArea").click(turretAreaClick);
	$("#turretArea").mousemove(turretAreaMouseMove);
}

function turretAreaMouseMove(e) {
	var canvasElementOffset = $("#turretCanvas").offset();
	mouseX = e.pageX - canvasElementOffset.left;
	mouseY = e.pageY - canvasElementOffset.top;
}

function checkForCollision(proj) {
	var collisionHappened = false;
	if (proj.checkForCollisionWithPlayer(player)) {
		player.takeDamage();
		freeze = true;
		collisionHappened = true;
	}

	var tempTurrets = [];
	for (var i = 0; i < turrets.length; i++) {
		if (proj.checkForCollisionWithPlayer(turrets[i])) { //using player function for collision with turrets, need to generalize this
			collisionHappened = true;
			var newEffect = new Effect(turrets[i].getX(), turrets[i].getY());
			newEffect.setColor(proj.getColor());
			newEffect.setRadius(turrets[i].getRadius());
			newEffect.duration = 50;
			effects.push(newEffect);
			score++;
		} else {
			tempTurrets.push(turrets[i]);
		}
	}
	turrets = tempTurrets;

	for (var i = 0; i < effects.length; i++) {
		if (proj.checkForCollisionWithPlayer(effects[i])) { //using player function for collision with turrets, need to generalize this
			collisionHappened = true;
		}
	}

	return collisionHappened;
}

function spawnNewRandomTurret() {
	if (freeze) {
		return;
	}

	var borderMargin = 10;
	var randTurretType = turretTypes[Math.floor(Math.random() * turretTypes.length)];
	var newTurret = new randTurretType(Math.random() * (ctx.canvas.width - 2*borderMargin) + borderMargin, Math.random() * (ctx.canvas.height - 2*borderMargin) + borderMargin);
	turrets.push(newTurret);

	turretLastSpawnedTick = tickCount;
}

function turretAreaClick() {
	//spawnNewRandomTurret();
}

//***************
//main game loop
//***************
function animate() {

	update();

	if (!freeze) {
		draw();
	}

	window.requestAnimFrame(animate);
}

//update player and turret states
function update() {
	if (freeze) {
		return;
	}

	player.update(mouseX, mouseY, ctx);

	for (var i = 0; i < turrets.length; i++) {
		turrets[i].update(player.getX(), player.getY(), projectiles);
	}

	var activeProjectiles = [];
	for (var i = 0; i < projectiles.length; i++) {
		if (projectiles[i].isInBounds()) {
			projectiles[i].update(player);

			if (checkForCollision(projectiles[i])) {
					var newEffect = new Effect(projectiles[i].getX(), projectiles[i].getY());
					newEffect.setColor(projectiles[i].getColor());
					newEffect.setRadius(projectiles[i].getRadius());
					effects.push(newEffect);
			} else {
					activeProjectiles.push(projectiles[i]);
			}
		} else {
			var newEffect = new Effect(projectiles[i].getX(), projectiles[i].getY());
			newEffect.setColor(projectiles[i].getColor());
			newEffect.setRadius(projectiles[i].getRadius());
			effects.push(newEffect);
		}
	}
	projectiles = activeProjectiles;

	var activeEffects = [];
	for (var i = 0; i < effects.length; i++) {
		if (effects[i].getFinished()) {

		} else {
			activeEffects.push(effects[i]);
			effects[i].update();
		}
	}
	effects = activeEffects;

	if (tickCount - turretLastSpawnedTick > turretSpawnDelay) {
		spawnNewRandomTurret();
		turretSpawnDelay *= turretSpawnDelayAccel;
	}

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

	$.each(effects, function(i,eff) {
		eff.draw(ctx);
	});
}
