var canvas,
	ctx,
	circles,
	saveCircleStarts,
	colors,
	gravity,
	cor,
	physicsType,
	physicsNames,
	now,
	then,
	fpsInterval,
	startTime;

//document ready function
$(function() {
	initializeSlider();

	initializeVariables();

	setEventHandlers();

	startAnimating();
});

//setup slider
function initializeSlider() {
	$("#slider").slider({
		value: 0,
		min: 0,
		max: 4,
		step: 1,
		slide: sliderMoved
	});
}

function initializeVariables() {

	canvas = $("#circlesCanvas");
	ctx = canvas[0].getContext("2d");

	//have to set height/width attributes to avoid weird canvas scaling issue
	canvas.attr("width", "600").attr("height", "400");

	//array of colors
	colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "black"];

	//circles = [new Circle(Math.random() * 200, Math.random() * 50, Math.random() * 10, Math.random() * 5, "red"), new Circle(Math.random() * 200, Math.random() * 250, Math.random() * 3, Math.random() * 9, "blue")];

	circles = [];
	saveCircleStarts = [];

	var i;
	var xPos, yPos, xSpeed, ySpeed;
	for (i = 0; i < 8; i++) {
		xPos = Math.random() * ctx.canvas.width;
		yPos = Math.random() * ctx.canvas.height;
		xSpeed = (5 - Math.random() * 10) * 60;
		ySpeed = (5 - Math.random() * 10) * 60;

		circles[i] = new Circle(xPos, yPos, xSpeed, ySpeed, colors[i]);
		saveCircleStarts[i] = [xPos, yPos, xSpeed, ySpeed];
	}

	/*
	circles = [new Circle(Math.random() * 50, Math.random() * 50, Math.random() * 10, Math.random() * 10, "red"),
				new Circle(50, 150, 8, 5, "orange"),
				new Circle(100, 50, 8, 5, "yellow"),
				new Circle(100, 150, 8, 5, "green"),
				new Circle(150, 50, 8, 5, "blue"),
				new Circle(150, 150, 8, 5, "purple"),
				new Circle(200, 50, 8, 5, "pink"),
				new Circle(200, 150, 8, 5, "black"),];

	*/
	gravity = 980; //inflated to counter scale of pixels. 1 pixel = 1 meter, so if this was a normal value things would fall extremely slowly
	cor = 0.95; //coefficient of restitution

	physicsType = 0;
	physicsNames = ["Realistic with bugs", "Looks normal...oh", "Party", "Accurate black hole simulator", "Quantum theory"];
}

//link events to their event handler functions
function setEventHandlers() {
	$("#circlesRestartButton").click(restartClicked);
	$("#circlesRandomizeButton").click(randomizeClicked);
}

//slider value changed
function sliderMoved(event, ui) {
	var newVal = ui.value;
	physicsType = newVal;
	$("#sliderText").text(physicsNames[newVal]);

	var i;
	for (i = 0; i < circles.length; i++) {
		saveCircleStarts[i] = [circles[i].getX(), circles[i].getY(), circles[i].getXSpeed(), circles[i].getYSpeed()];
	}
}

//reset circles to the positions and velocities they started this round with
function restartClicked() {
	var i;
	for (i = 0; i < circles.length; i++) {
		circles[i].setX(saveCircleStarts[i][0]);
		circles[i].setY(saveCircleStarts[i][1]);
		circles[i].setXSpeed(saveCircleStarts[i][2]);
		circles[i].setYSpeed(saveCircleStarts[i][3]);
	}
}

//set all circles to random positions and velocities
function randomizeClicked() {
	var i;
	for (i = 0; i < circles.length; i++) {
		xPos = Math.random() * ctx.canvas.width;
		yPos = Math.random() * ctx.canvas.height;
		xSpeed = (5 - Math.random() * 10) * 60;
		ySpeed = (5 - Math.random() * 10) * 60;

		circles[i].setX(xPos);
		circles[i].setY(yPos);
		circles[i].setXSpeed(xSpeed);
		circles[i].setYSpeed(ySpeed);

		saveCircleStarts[i] = [xPos, yPos, xSpeed, ySpeed];
	}
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
	if (elapsed > 0) { //fpsInterval) {
		then = now;// - (elapsed % fpsInterval);

		update(elapsed / 1000);

		draw();

	}
}

function update(dt) {
	switch(physicsType) {
		case 0:
			physicsType0Update(dt);
			break;
		case 1:
			physicsType1Update();
			break;
		case 2:
			physicsType2Update();
			break;
		case 3:
			physicsType3Update();
			break;
		case 4:
			physicsType4Update();
			break;
	}
}

//Realistic
function physicsType0Update(dt) {
	var i;
	for (i = 0; i < circles.length; i++) {
		circles[i].update(dt, ctx, gravity, cor);
	}

	var j;
	for (j = 0; j < circles.length; j++) {
		var k;
		for (k = j + 1; k < circles.length; k++) {
			var distBetweenCirclesSquared = Math.pow(circles[j].getX() - circles[k].getX(), 2) + Math.pow(circles[j].getY() - circles[k].getY(), 2);
			var combinedRadiiSquared = Math.pow(24, 2);
			if (distBetweenCirclesSquared <= combinedRadiiSquared) {
				circles[j].collision0WithCircle(circles[k]);
			}
		}
	}
}

//Realistic with random bursts of weirdness
function physicsType1Update() {
	var i;
	for (i = 0; i < circles.length; i++) {
		circles[i].update(1/59,ctx, gravity, cor);
	}

	var j;
	for (j = 0; j < circles.length; j++) {
		var k;
		for (k = j + 1; k < circles.length; k++) {
			var distBetweenCirclesSquared = Math.pow(circles[j].getX() - circles[k].getX(), 2) + Math.pow(circles[j].getY() - circles[k].getY(), 2);
			var combinedRadiiSquared = Math.pow(24, 2);
			if (distBetweenCirclesSquared <= combinedRadiiSquared) {
				circles[j].collision1WithCircle(circles[k]);
			}
		}
	}
}

//party, circles bunch together and kind of move as a group
function physicsType2Update() {
	var i;
	for (i = 0; i < circles.length; i++) {
		var j;
		for (j = 0; j < circles.length; j++) {
			if (i != j) {
				var distBetweenCirclesSquared = Math.pow(circles[i].getX() - circles[j].getX(), 2) + Math.pow(circles[i].getY() - circles[j].getY(), 2);
				var combinedRadiiSquared = Math.pow(24, 2);
				if (distBetweenCirclesSquared <= combinedRadiiSquared) {
					circles[i].collision2WithCircle(circles[j]);
				}
			}
		}
		circles[i].update(ctx, 0.4, cor);
	}
}

//black hole weirdness
function physicsType3Update() {
	var i;
	for (i = 0; i < circles.length; i++) {
		circles[i].update(ctx, gravity, 1);
	}

	var j;
	for (j = 0; j < circles.length; j++) {
		var k;
		for (k = j + 1; k < circles.length; k++) {
			var distBetweenCirclesSquared = Math.pow(circles[j].getX() - circles[k].getX(), 2) + Math.pow(circles[j].getY() - circles[k].getY(), 2);
			var combinedRadiiSquared = Math.pow(96, 2);
			if (distBetweenCirclesSquared <= combinedRadiiSquared) {
				circles[j].collision3WithCircle(circles[k]);
			}
		}
	}
}

//quantum theory, hard to explain
function physicsType4Update() {
	var i;
	for (i = 0; i < circles.length; i++) {
		circles[i].update(ctx, 0.5, cor);
		var j;
		for (j = 0; j < circles.length; j++) {
			if (i != j) {
				var distBetweenCirclesSquared = Math.pow(circles[i].getX() - circles[j].getX(), 2) + Math.pow(circles[i].getY() - circles[j].getY(), 2);
				var combinedRadiiSquared = Math.pow(24, 2);
				if (distBetweenCirclesSquared <= combinedRadiiSquared) {
					circles[i].collision4WithCircle(circles[j]);
				}
			}
		}
	}
}

function draw() {
	//clear the board
	ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

	//draw the circles
	var i;
	for (i = 0; i < circles.length; i++) {
		circles[i].draw(ctx);
	}
}
