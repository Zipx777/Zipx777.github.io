var canvas,
	ctx,
	player,
	freeze,
	turrets,
	projectiles,
	turret,
	turretTwo,
	mouseX,
	mouseY;

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

	player = new Player(0.2 * ctx.canvas.width, 0.5 * ctx.canvas.height);

	turret = new Turret(xPos, yPos);
	//turret = new Turret_Homing(xPos, yPos);

	freeze = false;

	//set initial mouse position to the player so the player doesn't immediately start traveling somewhere
	mouseX = player.getX();
	mouseY = player.getY();

	turrets = [];
	turrets.push(turret);

	projectiles = [];
}

function setEventHandlers() {
	$("#turretArea").click(turretAreaClick);
	$("#turretArea").mousemove(turretAreaMouseMove);
}

function turretAreaClick() {
	if (freeze) {
		return;
	}

	var borderMargin = 10;
	var coinFlip = Math.random() - 0.5;
	if (coinFlip > 0) {
		var newTurret = new Turret(Math.random() * (ctx.canvas.width - 2*borderMargin) + borderMargin, Math.random() * (ctx.canvas.height - 2*borderMargin) + borderMargin);
	} else {
		var newTurret = new Turret_Homing(Math.random() * (ctx.canvas.width - 2*borderMargin) + borderMargin, Math.random() * (ctx.canvas.height - 2*borderMargin) + borderMargin);
	}
	turrets.push(newTurret);
}

function turretAreaMouseMove(e) {
	var canvasElementOffset = $("#turretCanvas").offset();
	mouseX = e.pageX - canvasElementOffset.left;
	mouseY = e.pageY - canvasElementOffset.top;
}

function checkForCollision(proj) {
	if (proj.checkForCollisionWithPlayer(player)) {
		player.takeDamage();
		//freeze = true;
	}
}
//***************
//main game loop
//***************
function animate() {

	update();

	draw();

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
			activeProjectiles.push(projectiles[i]);
			checkForCollision(projectiles[i]);
		}
	}
	projectiles = activeProjectiles;
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
}
