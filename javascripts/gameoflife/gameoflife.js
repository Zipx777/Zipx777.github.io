var boardWidth;
var boardHeight;

var tileWidth;
var tileHeight;

//current state of all tiles (alive vs dead)
var boardState

//a place to temporarily store what the next step in the simulation will be
var futureBoardState;

//save the inital state of a currently running simulation
var savedBoardState;

var simulationRunning;

//document ready function
$(function() {
	initializeVariables();

	initializeBoard();

	initializeSelectOptions();
	
	initializeEventHandlers();
});

//set global variables to their initial values
function initializeVariables() {
	boardWidth = 640;
	boardHeight = 500;

	tileWidth = 10;
	tileHeight = 10;
	
	boardState = [];
	futureBoardState = [];
	savedBoardState = []
	
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		boardState[i] = [];
		futureBoardState[i] = [];
		savedBoardState[i] = [];
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			boardState[i][j] = 0;
			futureBoardState[i][j] = 0;
			savedBoardState[i][j] = 0;
		}
	}
	
	simulationRunning = false;
}

//set up tiles in the board area
function initializeBoard() {
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			var newTile = $("<div></div>");
			newTile.addClass("tile");
			newTile.addClass("dead");
			newTile.attr("id", i + "_" + j);
			$("#lifeBoard").append(newTile);
		}
	}
}

//set up options in dropdown select boxes
function initializeSelectOptions() {
	for (var i = 1; i < 9; i++) {
		var newOption = $("<option></option>");
		newOption.attr("value", i);
		newOption.text(i);
		$("#alive_min").append(newOption);
		$("#alive_max").append(newOption.clone());
		$("#dead_min").append(newOption.clone());
		$("#dead_max").append(newOption.clone());
	}
	
	$("#alive_min option[value=2]").attr("selected", true);
	$("#alive_max option[value=3]").attr("selected", true);
	$("#dead_min option[value=3]").attr("selected", true);
	$("#dead_max option[value=3]").attr("selected", true);
	
	examplePatterns.forEach(function(val, key) {
		var newOption = $("<option></option>");
		newOption.attr("value", key);
		newOption.text(key);
		$("#exampleSelect").append(newOption);
	});
}

//set up functions to handle events like clicks
function initializeEventHandlers() {
	$(".tile").mousedown(tileClick);
	$("#startStopButton").mousedown(startStopClick);
	$("#stepButton").mousedown(stepClick);
	$("#clearButton").mousedown(clearClick);
	$("#resetButton").mousedown(resetClick);
	$("#exampleCreateButton").mousedown(exampleCreateClick);
	
	$("#testOutputButton").mousedown(outputLivingTiles);
}

//player clicks on a tile
function tileClick() {
	if (!simulationRunning) {
		toggleTileState($(this));
		getBoardState();
		copyArray(savedBoardState, boardState);
	}
}

//if tile is alive, set it to dead, and vice versa
function toggleTileState(tile) {
	if (tile.hasClass("dead") == true) {
		tile.removeClass("dead");
		tile.addClass("alive");
	} else if (tile.hasClass("alive")) {
		tile.removeClass("alive");
		tile.addClass("dead");
	}
}

//start the simulation
function startStopClick() {
	if (simulationRunning) {
		stopSimulation();
	} else {
		//getBoardState();
		simulationRunning = true;
		$(this).text("Pause");
		runSimulation();
	}
}

//set boardState variable to store current state of tiles
function getBoardState() {
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			var tileAlive = $("#" + i + "_" + j).hasClass("alive");
			if (tileAlive) {
				boardState[i][j] = 1;
			} else {
				boardState[i][j] = 0;
			}
		}
	}
}

//advance one step in the simulation
function stepClick() {
	stopSimulation();
	singleSimulationStep();
}

function singleSimulationStep() {
	var aliveMin = $("#alive_min").find(":selected").val();
	var aliveMax = $("#alive_max").find(":selected").val();
	var deadMin = $("#dead_min").find(":selected").val();
	var deadMax = $("#dead_max").find(":selected").val();

	var totalAlive = 0;	
	
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			var neighborCount = countNeighbors(i, j);
			if (tileIsAlive(i,j)) {
				totalAlive++;
				
				if (neighborCount < aliveMin || neighborCount > aliveMax) {
					futureBoardState[i][j] = 0;
				} else {
					futureBoardState[i][j] = 1;
				}
			} else {
				if (neighborCount < deadMin || neighborCount > deadMax) {
					futureBoardState[i][j] = 0;
				} else {
					futureBoardState[i][j] = 1;
				}
			}
			
			if (boardState[i][j] != futureBoardState[i][j]) {
				updateTile(i,j,futureBoardState[i][j]);
			}
		}
	}
	
	copyArray(boardState, futureBoardState);
	
	if (totalAlive == 0) {
		stopSimulation();
	}
}

//return how many alive neighbors there are to a square with position (x,y)
function countNeighbors(i, j) {
	var count = 0;
	for (var x = -1; x <= 1; x++) {
		for (var y = -1; y <= 1; y++) {
			if (x != 0 || y != 0) {
				if (i+x >= 0 && j+y >= 0) {
					if (i+x < boardHeight/tileHeight && j+y < boardWidth/tileWidth) {
						if (tileIsAlive(i+x, j+y)) {
							count++;
						}
					}
				}
			}
		}
	}
	return count;
}

//returns whether the passed tile is alive
function tileIsAlive(i,j) {
	return (boardState[i][j] == 1);
}

//update visual state of tile to match actual state
function updateTile(i, j, state) {
	var tile = $("#" + i + "_" + j);
	if (state == 0) {
		tile.removeClass("alive");
		tile.addClass("dead");
	} else if (state == 1) {
		tile.removeClass("dead");
		tile.addClass("alive");
	}
}

//update visual state of board to match actual state
//DEPRECATED: currently unused, due to optimizations
function updateBoard() {
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			var tile = $("#" + i + "_" + j);
			tile.removeClass("alive");
			tile.removeClass("dead");
			if (boardState[i][j] == 0) {
				tile.addClass("dead");
			} else if (boardState[i][j] == 1) {
				tile.addClass("alive");
			}
		}
	}
}

//clear board to empty state
function clearClick() {
	clearBoard();
	stopSimulation();
}

function clearBoard() {
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			if (boardState[i][j] = 1) {
				boardState[i][j] = 0;
				updateTile(i,j,0);
			}
		}
	}
}

function resetClick() {
	clearBoard();
	stopSimulation();
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			if (boardState[i][j] != savedBoardState[i][j]) {
				updateTile(i,j,savedBoardState[i][j]);
				boardState[i][j] = savedBoardState[i][j];
			}
		}
	}
}

function exampleCreateClick() {
	var pattern = $("#exampleSelect").find(":selected").val();
	var patternPoints = examplePatterns.get(pattern);
	
	clearBoard();
	stopSimulation();
	
	for (var i = 0; i < patternPoints.length; i++) {
		updateTile(patternPoints[i][0], patternPoints[i][1], 1);
	}
	
	getBoardState();
	copyArray(savedBoardState, boardState);
}

//start simulation that will repeat itself
function runSimulation() {
	if (simulationRunning) {
		singleSimulationStep();
		window.requestAnimFrame(runSimulation);
	}
}

function testArrayAlert(array) {
	var state = "";
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			state += array[i][j];
		}
	}
	alert(state);
}

function outputLivingTiles() {
	var livingTiles = "";
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			if (tileIsAlive(i,j)) {
				livingTiles += "[" + i + "," + j + "],";
				livingTiles += "\n";
			}
		}		
	}
	alert(livingTiles);
}


//pause the simulation, or if there are 0 alive tiles stop it
function stopSimulation() {
	simulationRunning = false;
	var aliveTiles = 0;
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			if (tileIsAlive(i,j)) {
				aliveTiles++;
			}
		}
	}
	if (aliveTiles > 0) {
		//pause the simulation
		$("#startStopButton").text("Resume");
	} else {
		//stop the simulation
		$("#startStopButton").text("Start");
	}
}

//copy contents of array2 into array 1
function copyArray(array1, array2) {
	for (var i = 0; i < boardHeight/tileHeight; i++) {
		for (var j = 0; j < boardWidth/tileWidth; j++) {
			array1[i][j] = array2[i][j];
		}
	}
}
