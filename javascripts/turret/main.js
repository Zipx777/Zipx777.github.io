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
	mouseX = 0;
	mouseY = 0;

	canvas = $("#turretCanvas");
	ctx = canvas[0].getContext("2d");

	//have to set height/width attributes to avoid weird canvas scaling issue
	canvas.attr("width", "600").attr("height", "400");

	var xPos = 0.5 * ctx.canvas.width;
	var yPos = 0.5 * ctx.canvas.height;

	var testVector = new Vector(1,-1);

	player = new Player(0,0);
	turret = new Turret(xPos, yPos, 15);
	turretTwo = new Turret(xPos + 100, yPos + 100);

	turrets = [];
	projectiles = [];

	turrets.push(turret);
}

function setEventHandlers() {
	$("#turretArea").click(turretAreaClick);
	$("#turretArea").mousemove(turretAreaMouseMove);
}

function turretAreaClick() {
	var testVector = new Vector(1,1);
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
