var canvas,
	ctx,
	players,
	winningPlayer,
	goals,
	puck,
	arrowKeys,
	wasdKeys;

var gamePaused = true;
var gameRunning = false;

var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

//document ready function
$(function() {
	initializeVariables();
	
	populateColors();
	
	positionPiecesAtStart();	
	
	setEventHandlers();	
	
	//start the loop
	animate();
});

//initializes all global variables
function initializeVariables() {
	canvas = $("#bumpersCanvas");
	ctx = canvas[0].getContext("2d");
	
	//have to set height/width attributes to avoid weird canvas scaling issue
	canvas.attr("width", "600").attr("height", "400");
	
	goals = [new Goal((ctx.canvas.width / 2), 0, "horizontal"),
			new Goal((ctx.canvas.width / 2), ctx.canvas.height, "horizontal"),
			new Goal(0, (ctx.canvas.height / 2), "vertical"),
			new Goal(ctx.canvas.width, (ctx.canvas.height / 2), "vertical")];	
		
	players = [new Player(0, 0, "red"), new Player(0, 0, "blue")];	
	
	//when a player wins the game, this will be set to 0 or 1
	winningPlayer = -1;
	
	puck = new Puck(0, 0);
	
	arrowKeys = new Keys("arrows");
	wasdKeys = new Keys("wasd");
}

//adds all the colors to the options for the players
function populateColors() {
	var i;
	var nextColor;
	for (i = 0; i < CSS_COLOR_NAMES.length; i++) {		
		$("#player1Color").append("<option value='" + CSS_COLOR_NAMES[i] + "'>" + CSS_COLOR_NAMES[i] + "</option>");
		$("#player2Color").append("<option value='" + CSS_COLOR_NAMES[i] + "'>" + CSS_COLOR_NAMES[i] + "</option>");
	}
	
	$("#player1Color option[value=Red]").prop("selected", true);
	$("#player2Color option[value=Blue]").prop("selected", true);
}

//sets event handlers
function setEventHandlers() {
	$(document).keydown(keyDownHandler);
	$(document).keyup(keyUpHandler);
	
	$("#bumpersStartPauseButton").click(startPauseClicked);
	$("#bumpersResetButton").click(resetClicked);
	
	$("#player1Color").change(player1ColorChanged);
	$("#player2Color").change(player2ColorChanged);
}

//position players at starting positions in front of the side goals
function positionPiecesAtStart() {
	var p1StartX = (goals[2].getWidth() / 2) + players[0].getRadius(),
		p1StartY = ctx.canvas.height / 2,
		p2StartX = ctx.canvas.width - (goals[3].getWidth() / 2) - players[1].getRadius(),
		p2StartY = ctx.canvas.height / 2;
		
		players[0].setX(p1StartX);
		players[0].setY(p1StartY);
		players[1].setX(p2StartX);
		players[1].setY(p2StartY);
		
		puck.setX(ctx.canvas.width / 2);
		puck.setY(ctx.canvas.height / 2);
		puck.reset(); //randomizes direction
}

//handler when a key is pressed
function keyDownHandler(e) {
	if (e.which == 32) {
		e.preventDefault();
		$("#bumpersStartPauseButton").click();
	} else if (e.which >= 37 && e.which <= 40) {
		//stop screen scrolling with arrow keys
		e.preventDefault();
		arrowKeys.onKeyDown(e);
	} else {
		wasdKeys.onKeyDown(e);
	}
}

//handler for when a key is released
function keyUpHandler(e) {
	//fix for spacebar doing last click action on keyUp bug
	if (e.which == 32) {
		e.preventDefault();
	}
	
	arrowKeys.onKeyUp(e);
	wasdKeys.onKeyUp(e);
}

//color option for player 1 changed
function player1ColorChanged() {
	players[0].setColor($(this).find("option:selected").val());
}

//color option for player 2 changed
function player2ColorChanged() {
	players[1].setColor($(this).find("option:selected").val());
}

//start or pause button was clicked, toggle between the two
function startPauseClicked() {
	$("#player1Color").prop("disabled", true);
	$("#player2Color").prop("disabled", true);
	if (gamePaused) {
		gamePaused = false;
		gameRunning = true;
		$(this).text("Pause");
	} else {
		gamePaused = true;
		$(this).text("Resume");
	}
}

//reset button was clicked
function resetClicked() {
	gamePaused = true;
	gameRunning = false;
	winningPlayer = -1;
	
	$("#bumpersStartPauseButton").text("Start");
	$("#bumpersStartPauseButton").prop("disabled", false);
	
	positionPiecesAtStart();
	resetGoals();
	resetPuck();
	
	$("#player1Color").prop("disabled", false);
	$("#player2Color").prop("disabled", false);	
	
	wasdKeys.reset();
	arrowKeys.reset();
}

//reset goals' states
function resetGoals() {
	var i;
	for (i = 0; i < goals.length; i++) {
		goals[i].reset();
	}
}

//reset puck state
function resetPuck() {
	puck.reset();
}

//***************
//main game loop
//***************
function animate() {
	update();
	
	draw();
	
	window.requestAnimFrame(animate);
}

//update game pieces' positions
function update() {
	if (!gamePaused) {
		if (!checkForWin()) {
			//update the players
			players[0].update(ctx, wasdKeys);
			players[1].update(ctx, arrowKeys);
			
			//update the puck
			puck.update(ctx, players);
			
			//update the goals
			var i;
			for (i = 0; i < goals.length; i++) {
				goals[i].update(puck);
			}	
		}			
	}
}

//draw the canvas
function draw() {
	//clear the board
	ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
	
	//draw the players
	var i;
	for (i = 0; i < players.length; i++) {
		players[i].draw(ctx);
	}
	
	//draw the goals
	var j;
	for (j = 0; j < goals.length; j++) {
		goals[j].draw(ctx);
	}
	
	//draw the puck
	puck.draw(ctx);
	
	//if a player has won, display win text
	if (winningPlayer >= 0) {
		ctx.font = "30px Verdana";
		ctx.fillStyle = players[winningPlayer].getColor();
		ctx.fillText("Player " + (winningPlayer + 1) + " won!", (ctx.canvas.width / 2) - 100, ctx.canvas.height / 2);
	}
}

//check for a game win, return true if the game was won
function checkForWin() {
	//loop through all goals to see if they were all last hit by the same player		
	var potentialWinner = goals[0].getLastPlayerHit();
	var win = true;
	
	//win is false if potentialWinner is -1 because that means the goal hasn't been hit yet
	if (potentialWinner == -1) {
		win = false;
	}
	
	var j;
	for (j = 0; j < goals.length; j++) {
		if (goals[j].getLastPlayerHit() != potentialWinner) {
			win = false;
		}
	}
	
	if (win) {
		gameWon(potentialWinner);
	}
	return win;
}

//game was won by a player
function gameWon(p) {
	gamePaused = true;
	winningPlayer = p;;
	$("#bumpersStartPauseButton").prop("disabled", true);
}
