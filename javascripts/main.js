var canvas,
	ctx,
	gameLoop,
	countUpdater,
	tickRate,
	currentPoint,
	seedPoints,
	pointCount;

//document ready function
$(function() {
	initializeSlider();
	
	initializeVariables();
	
	setEventHandlers();
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
	
	canvas = $("#patternsCanvas");
	ctx = canvas[0].getContext("2d");
	gameLoop = null;
	countUpdater = null;
	tickRate = 1;
	
	currentPoint = [300, 200];
	seedPoints = [
		[300, 10],
		[100, 390],
		[500, 390],
	];
	
	pointCount = 0;
}

//link events to their event handler functions
function setEventHandlers() {
	$("#patternsStartButton").click(startClicked);
	$("#patternsStopButton").click(stopClicked);
}

//slider value changed
function sliderMoved(event, ui) {
	var newVal = ui.value;
	$("#sliderText").text("hello");
}

function startClicked() {
	gameLoop = setInterval(animate, tickRate);
	countUpdater = setInterval(updateCount, 100);
}

function stopClicked() {
	window.clearInterval(gameLoop);
	window.clearInterval(countUpdater);
}

function getHalfwayPoint(x1, y1, x2, y2) {
	var point = [0,0];
	point[0] = (x1 + x2) / 2;
	point[1] = (y1 + y2) / 2;
	return point;
}

//***************
//main game loop
//***************
function animate() {

	update();

	draw();
	
}

function update() {
	var newTargetPoint = Math.floor(Math.random() * 3);
	var x1 = currentPoint[0];
	var y1 = currentPoint[1];
	var x2 = seedPoints[newTargetPoint][0];
	var y2 = seedPoints[newTargetPoint][1];
	currentPoint = getHalfwayPoint(x1, y1, x2, y2);
	pointCount += 1;
}

function draw() {
	ctx.fillRect(currentPoint[0],currentPoint[1],2,2);
}

function updateCount() {
	$("#sliderText").text(pointCount);
}