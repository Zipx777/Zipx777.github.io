var canvas,
	ctx,
	gameLoop,
	countUpdater,
	tickRate,
	defaultDistanceFraction,
	distanceFraction,
	pointSize,
	currentPoint,
	seedPointSize,
	seedPoints,
	pointCount,
	defaultDrawSpeed,
	drawSpeed;

//document ready function
$(function() {
	initializeVariables();
	
	initializeSlider();
	
	setEventHandlers();
});

function initializeVariables() {
	
	canvas = $("#patternsCanvas");
	ctx = canvas[0].getContext("2d");
	gameLoop = null;
	countUpdater = null;
	tickRate = 10;
	defaultDistanceFraction = 0.5;
	distanceFraction = defaultDistanceFraction;
	
	pointSize = 1;
	currentPoint = [0, 0];
	
	seedPointSize = 3;
	seedPoints = [];
	
	initializeSelector();
	
	pointCount = 0;
	
	defaultDrawSpeed = 1;
	drawSpeed = defaultDrawSpeed;
}

function initializeSelector() {
	for (var i = 1; i < 10; i+=1) {
		var newOption = $("<option></option>");
		newOption.attr("value", i/10);
		newOption.text(i/10);
		if (i/10 == defaultDistanceFraction) {
			newOption.attr("selected", true);
		}
		$("#moveFractionSelector").append(newOption);
	}
	
	$("#moveFractionSelector[value=2]").attr("selected", true);
}

//setup slider
function initializeSlider() {
	$("#slider").slider({
		value: defaultDrawSpeed,
		min: 1,
		max: 5,
		step: 1,
		slide: sliderMoved
	});
}

//link events to their event handler functions
function setEventHandlers() {
	$("#patternsStartButton").click(startClicked);
	$("#patternsStopButton").click(stopClicked);
	$("#patternsClearButton").click(clearClicked);
	
	$("#patternsCanvas").click(canvasClicked);
}

function canvasClicked(e) {
	var dotX = e.clientX - canvas.offset().left + window.scrollX;
	var dotY = e.clientY - canvas.offset().top + window.scrollY;
	drawSeedPoint(dotX, dotY);
	
	var newDot = [dotX, dotY];
	seedPoints.push(newDot);
}

function drawSeedPoint(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, seedPointSize, 0, 2 * Math.PI, false);
	ctx.fill();
}

//slider value changed
function sliderMoved(event, ui) {
	var newVal = ui.value;
	drawSpeed = newVal;
}

function startClicked() {
	killSimulation();
	currentPoint = getAvgOfSeedPoints();
	gameLoop = setInterval(animate, tickRate);
	countUpdater = setInterval(updateCount, 100);
}

function getAvgOfSeedPoints() {
	var totalX = 0;
	var totalY = 0;
	for (var i = 0; i < seedPoints.length; i++) {
		totalX += seedPoints[i][0];
		totalY += seedPoints[i][1];
	}
	var pt = [];
	pt[0] = totalX / seedPoints.length;
	pt[1] = totalY / seedPoints.length;
	return pt;
}

function stopClicked() {
	killSimulation();
}

function clearClicked() {
	killSimulation();
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	seedPoints = [];
	pointCount = 0;
	updateCount();
}

function killSimulation() {
	window.clearInterval(gameLoop);
	updateCount();
	window.clearInterval(countUpdater);
}

function getMiddlePoint(x1, y1, x2, y2) {
	var point = [0,0];
	point[0] = x1 + (x2 - x1) * distanceFraction;
	point[1] = y1 + (y2 - y1) * distanceFraction;
	return point;
}

//***************
//main game loop
//***************
function animate() {
	for (var i = 0; i < 1; i++) {
		update();

		draw();
	}
	
}

function update() {
	distanceFraction = $("#moveFractionSelector").find(":selected").val();
	var newTargetPoint = Math.floor(Math.random() * seedPoints.length);
	var x1 = currentPoint[0];
	var y1 = currentPoint[1];
	var x2 = seedPoints[newTargetPoint][0];
	var y2 = seedPoints[newTargetPoint][1];
	currentPoint = getMiddlePoint(x1, y1, x2, y2);
	pointCount += 1;
}

function draw() {
	var offset = pointSize / 2;
	ctx.fillRect(currentPoint[0] - offset,currentPoint[1] - offset,pointSize,pointSize);
}

function updateCount() {
	$("#sliderText").text(pointCount);
}

//currently unused
function drawShapeOutline() {
	for (var i = 0; i < seedPoints.length; i++) {
		ctx.beginPath();
		ctx.moveTo(seedPoints[i][0], seedPoints[i][1]);
		var j = i + 1;
		if (j >= seedPoints.length) {
			j = 0;
		}
		ctx.lineTo(seedPoints[j][0], seedPoints[j][1]);
		ctx.stroke();
	}
}
