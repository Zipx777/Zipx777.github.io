var canvas,
	ctx,
	player,
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

	//have to set height/width attributes to avoid weird canvas scaling issue
	canvas.attr("width", "600").attr("height", "400");

	var xPos = 0.5 * ctx.canvas.width;
	var yPos = 0.5 * ctx.canvas.height;

	player = new Player(0.2 * ctx.canvas.width, 0.5 * ctx.canvas.height);
	turret = new Turret(xPos, yPos);

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
	var newTurret = new Turret(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
	turrets.push(newTurret);
}

function turretAreaMouseMove(e) {
	var canvasElementOffset = $("#turretCanvas").offset();
	mouseX = e.pageX - canvasElementOffset.left;
	mouseY = e.pageY - canvasElementOffset.top;
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
	player.update(mouseX, mouseY, ctx);

	for (var i = 0; i < turrets.length; i++) {
		turrets[i].update(player.getX(), player.getY(), projectiles);
	}

	for (var i = 0; i < projectiles.length; i++) {
		if (projectiles[i].isInBounds()) {
			projectiles[i].update(mouseX, mouseY);
		} else {
			projectiles.splice(i,1);
		}
	}
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
