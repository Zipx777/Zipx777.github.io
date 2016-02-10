var canvas,
	ctx,
	circles,
	gravity,
	cor;

//document ready function
$(function() {
	initializeVariables();
	animate();
});

function initializeVariables() {
	
	canvas = $("#circlesCanvas");
	ctx = canvas[0].getContext("2d");

	//have to set height/width attributes to avoid weird canvas scaling issue
	canvas.attr("width", "600").attr("height", "400");

	circles = [new Circle(Math.random() * 200, Math.random() * 50, Math.random() * 10, Math.random() * 5, "red"), new Circle(Math.random() * 200, Math.random() * 250, Math.random() * 3, Math.random() * 9, "blue")];
	
	gravity = 0.2;
	cor = 0.95; //coefficient of restitution
}

//***************
//main game loop
//***************
function animate() {

	update();

	draw();
	
	window.requestAnimFrame(animate);
}

function update() {
	var i;
	for (i = 0; i < circles.length; i++) {
		circles[i].update(ctx, gravity, cor);
	}
	
	var distBetweenCircles = Math.sqrt(Math.pow(circles[0].getX() - circles[1].getX(), 2) + Math.pow(circles[0].getY() - circles[1].getY(), 2));
	if (distBetweenCircles <= 24) {
		circles[0].collisionWithCircle(circles[1]);
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
