var ROWS,
		COLUMNS,
		DEL,
		boardState_horizontalLines,
		boardState_verticalLines,
		boardState_tiles;

//document ready function
$(function() {
	initializeVariables();

	initializeBoard();

	setEventHandlers();
});

function initializeVariables() {
	ROWS = 7;
	COLUMNS = 7;

	//DELiniator for element IDs on the grid
	DEL = "_";

	boardState_tiles = [
		[ , , , , , , ,],
		[ , , , , , , ,],
		[ , , , , , , ,],
		[ , , , , , , ,],
		[ , , , , , , ,],
		[ , , , , , , ,],
		[ , , , , , , ,]
	];
/*
	boardState_tiles = [
		[3,2,1,2, ,2, ],
		[ , , ,1,1,1, ],
		[ ,2, ,2, , , ],
		[2,1,2,0,1,1, ],
		[1,2,3, ,0,1, ],
		[ , ,0,3, ,1, ],
		[3, , , , ,1, ]
	];
*/
	boardState_horizontalLines = new Array(ROWS + 1);
	for (var i = 0; i < ROWS + 1; i++) {
		boardState_horizontalLines[i] = new Array(COLUMNS);
	}

	boardState_verticalLines = new Array(ROWS);
	for (var i = 0; i < ROWS; i++) {
		boardState_verticalLines[i] = new Array(COLUMNS + 1);
	}
}

function initializeBoard() {
	//top
	for (var i = 0; i < COLUMNS; i++) {
		var newConnector = $("<div></div>");
		newConnector.addClass("connector-square");
		$("#loopyBoard").append(newConnector);

		var newHorizLine = $("<div></div>");
		newHorizLine.addClass("horizontal-line");
		newHorizLine.addClass("line-dormant");
		var idStr = "h" + DEL + "0" + DEL + i;
		newHorizLine.attr('id', idStr);
		$("#loopyBoard").append(newHorizLine);

		boardState_horizontalLines[0][i] = 0;
	}
	var newConnector = $("<div></div>");
	newConnector.addClass("connector-square");
	$("#loopyBoard").append(newConnector);

	//repeated body + bottom
	for (var i = 0; i < COLUMNS; i++) {
		for (var j = 0; j < ROWS; j++) {
			var newVertLine = $("<div></div>");
			newVertLine.addClass("vertical-line");
			newVertLine.addClass("line-dormant");
			var idStr = "v" + DEL + i + DEL + j;
			newVertLine.attr('id', idStr);
			$("#loopyBoard").append(newVertLine);

			boardState_verticalLines[i][j] = 0;

			var newTile = $("<div></div>");
			newTile.addClass("tile");
			newTile.attr("id", "t" + DEL + i + DEL + j);
			newTile.text(boardState_tiles[i][j]);
			$("#loopyBoard").append(newTile);
		}
		var newVertLine = $("<div></div>");
		newVertLine.addClass("vertical-line");
		newVertLine.addClass("line-dormant");
		newVertLine.attr('id', "v" + DEL + i + DEL + ROWS);
		$("#loopyBoard").append(newVertLine);

		boardState_verticalLines[i][ROWS] = 0;

		for (var j = 0; j < ROWS; j++) {
			var newConnector = $("<div></div>");
			newConnector.addClass("connector-square");
			$("#loopyBoard").append(newConnector);

			var newHorizLine = $("<div></div>");
			newHorizLine.addClass("horizontal-line");
			newHorizLine.addClass("line-dormant");
			newHorizLine.attr('id', "h" + DEL + (i + 1) + DEL + j);
			$("#loopyBoard").append(newHorizLine);

			boardState_horizontalLines[i + 1][j] = 0;
		}

		var newConnector = $("<div></div>");
		newConnector.addClass("connector-square");
		$("#loopyBoard").append(newConnector);
	}

	initiateLoopCreation();

	testGenerateGrid();
}

//link events to their event handler functions
function setEventHandlers() {
	$(".horizontal-line").mousedown(lineClick);
	$(".vertical-line").mousedown(lineClick);
	$(".tile").mousedown(tileClick);
}

//if tile is not yet revealed, reveal it and add one to score
function tileClick(event) {
	var id = $(this).attr('id');
	var idValues = id.split(DEL);
	var tileRow = parseInt(idValues[1]);
	var tileCol = parseInt(idValues[2]);

	if (!$(this).hasClass("revealed")) {
		$(this).addClass("revealed");
		$(this).text(boardState_tiles[tileRow][tileCol]);
	}
}

function lineClick(event) {

	var id = $(this).attr('id');
	var idValues = id.split(DEL);
	var lineType = idValues[0];
	var lineRow = parseInt(idValues[1]);
	var lineCol = parseInt(idValues[2]);

	var lineArray;
	if (lineType == "h") {
		lineArray = boardState_horizontalLines;
	} else if (lineType == "v") {
		lineArray = boardState_verticalLines;
	} else {
		alert("what happened here, line didn't have an h or v line type");
	}

	switch(event.which) {
		case 1:
			if ($(this).hasClass("line-dormant")) {
				setLineState($(this), "on");
			} else if ($(this).hasClass("line-on")) {
				setLineState($(this), "off");
			} else if ($(this).hasClass("line-off")) {
				setLineState($(this), "dormant");
			} else {
				alert("what happened here, how did this happen, a line is missing a class");
			}
			break;
		case 3:
			setLineState($(this), "off");
			break;
		default:
	}

	var tile1EdgesAreValid = false;
	var tile2EdgesAreValid = false;

	if (lineType == "h") {
		var tile1ToCheck = [lineRow, lineCol];
		var tile2ToCheck = [lineRow - 1, lineCol];
		if (lineRow == 0) {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
		} else if (lineRow == COLUMNS) {
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		} else {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		}
	} else if (lineType == "v") {
		var tile1ToCheck = [lineRow, lineCol];
		var tile2ToCheck = [lineRow, lineCol - 1];
		if (lineCol == 0) {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
		} else if (lineCol == ROWS) {
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		} else {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		}
	} else {
		alert("ahhhhhhhhhhhhhhhh");
	}

	var tile1ID = "#t" + DEL + tile1ToCheck[0] + DEL + tile1ToCheck[1];
	var tile2ID = "#t" + DEL + tile2ToCheck[0] + DEL + tile2ToCheck[1];
	var tileElement = $(tile1ID);
	if (tile1EdgesAreValid) {
		if (tileElement.hasClass("tile-error")) {
			tileElement.removeClass("tile-error");
		}
	} else {
		if (!tileElement.hasClass("tile-error")) {
			tileElement.addClass("tile-error");
		}
	}

	var tileElement = $(tile2ID);
	if (tile2EdgesAreValid) {
		if (tileElement.hasClass("tile-error")) {
			tileElement.removeClass("tile-error");
		}
	} else {
		if (!tileElement.hasClass("tile-error")) {
			tileElement.addClass("tile-error");
		}
	}

	checkForGameEnd();
}

//returns an array of tiles cardinally adjacent to one
function getAdjacentTiles(tile) {
	var tileID = tile.attr("id");
	var idSplit = tileID.split(DEL);
	var tileRow = parseInt(idSplit[1]);
	var tileCol = parseInt(idSplit[2]);

	var adjacentTiles = [];

	var topTileRow = tileRow - 1;
	var botTileRow = tileRow + 1;
	var leftTileCol = tileCol - 1;
	var rightTileCol = tileCol + 1;

	if (topTileRow >= 0) {
		var topTileId = "#t" + DEL + topTileRow + DEL + tileCol;
		adjacentTiles.push($(topTileId));
	}

	if (botTileRow < COLUMNS) {
		var botTileId = "#t" + DEL + botTileRow + DEL + tileCol;
		adjacentTiles.push($(botTileId));
	}

	if (leftTileCol >= 0) {
		var leftTileId = "#t" + DEL + tileRow + DEL + leftTileCol;
		adjacentTiles.push($(leftTileId));
	}

	if (rightTileCol < ROWS) {
		var rightTileId = "#t" + DEL + tileRow + DEL + rightTileCol;
		adjacentTiles.push($(rightTileId));
	}

	return adjacentTiles;
}

//returns an array with the 4 edges surrounding a tile
function getTileEdges(tile) {
	var tileID = tile.attr("id");
	var idSplit = tileID.split(DEL);
	var tileRow = parseInt(idSplit[1]);
	var tileCol = parseInt(idSplit[2]);

	var vEdge1 = $("#v" + DEL + tileRow + DEL + tileCol);
	var vEdge2 = $("#v" + DEL + tileRow + DEL + (tileCol + 1));
	var hEdge1 = $("#h" + DEL + tileRow + DEL + tileCol);
	var hEdge2 = $("#h" + DEL + (tileRow + 1) + DEL + tileCol);

	var edges = [vEdge1, vEdge2, hEdge1, hEdge2];
	return edges;
}

//return true if tile has equal or less edges filled in
//return false if tile has more edges filled in than its number
//return false if too many lines have been turned off
function tileEdgeCountIsValid(tileRow, tileCol) {
	var tileElement = $("#t" + DEL + tileRow + DEL + tileCol);
	var tileNum = boardState_tiles[tileRow][tileCol];

	var committedCount = 0;
	var availableCount = 0;

	var edgeValues = [
		boardState_horizontalLines[tileRow][tileCol],
		boardState_horizontalLines[(tileRow+1)][tileCol],
		boardState_verticalLines[tileRow][tileCol],
		boardState_verticalLines[tileRow][(tileCol+1)]
	];

	for (var i = 0; i < edgeValues.length; i++) {
		if (edgeValues[i] == 1) {
			committedCount++;
		}

		availableCount++;
		if (edgeValues[i] == -1) {
			availableCount -= 1;
		}
	}

	if (committedCount > tileNum || availableCount < tileNum) {
		return false;
	} else {
		return true;
	}
}

function getLineState(line) {
	var lineID = line.attr("id");
	var idSplit = lineID.split(DEL);
	var lineType = idSplit[0];
	var lineRow = parseInt(idSplit[1]);
	var lineCol = parseInt(idSplit[2]);
	var lineArray;
	if (lineType == "h") {
		lineArray = boardState_horizontalLines;
	} else if (lineType == "v") {
		lineArray = boardState_verticalLines;
	}

	var state = lineArray[lineRow][lineCol];
	if (state == 1) {
		return "on";
	} else if (state == 0) {
		return "dormant";
	} else if (state == -1) {
		return "off";
	} else {
		alert(state);
		alert("ahhhhhhhhhh how does a line not have a state this is bad");
	}
}

function setLineState(line, state) {
	line.removeClass("line-on line-off line-dormant");

	var stateNum;
	if (state == "on") {
		stateNum = 1;
	} else if (state == "dormant") {
		stateNum = 0;
	} else if (state == "off") {
		stateNum = -1;
	} else {
		alert("tried to set line to invalid state");
	}
	var lineID = line.attr("id");
	var idSplit = lineID.split(DEL);
	var lineType = idSplit[0];
	var lineRow = parseInt(idSplit[1]);
	var lineCol = parseInt(idSplit[2]);
	var lineArray;
	if (lineType == "h") {
		lineArray = boardState_horizontalLines;
	} else if (lineType == "v") {
		lineArray = boardState_verticalLines;
	}

	lineArray[lineRow][lineCol] = stateNum;
	line.addClass("line-" + state);
}

function printArray(array) {
	var arrayString = "";
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array[i].length; j++) {
			//alert(i + " " + j);
			if (array[i][j] == null) {
				arrayString += " _ ";
			} else {
				if (array[i][j] >= 0) {
					arrayString += " ";
				}
				arrayString += array[i][j].toString() + " ";
			}

		}
		arrayString += "\n";
	}
	alert(arrayString);
}

//+++++++++++++++++++++
//TEST BOARD GENERATION
//+++++++++++++++++++++

var tileSubtractCandidates = [];
var tileSubtractCandidatesUsed = [];

function initiateLoopCreation() {
	for (var i = 0; i < boardState_horizontalLines[0].length; i++) {
		var hTopLine = $("#h" + DEL + "0" + DEL + i);
		var topTile = $("#t" + DEL + "0" + DEL + i);
		setLineState(hTopLine, "on");

		var hBotLine = $("#h" + DEL + (boardState_horizontalLines.length - 1) + DEL + i);
		var botTile = $("#t" + DEL + (boardState_horizontalLines.length - 2) + DEL + i)
		setLineState(hBotLine, "on");

		tileSubtractCandidates.push(topTile);
		tileSubtractCandidates.push(botTile);
	}

	for (var i = 0; i < boardState_verticalLines.length; i++) {
		var vLeftLine = $("#v" + DEL + i + DEL + "0");
		var leftTile = $("#t" + DEL + i + DEL + "0");
		setLineState(vLeftLine, "on");

		var vRightLine = $("#v" + DEL + i + DEL + (boardState_verticalLines[0].length - 1));
		var rightTile = $("#t" + DEL + i + DEL + (boardState_verticalLines[0].length - 2));
		setLineState(vRightLine, "on");

		//don't re-add the corners
		if (i > 0 && i < boardState_verticalLines.length - 1) {
			tileSubtractCandidates.push(leftTile);
		};

		if (i > 0 && i < boardState_verticalLines.length - 1) {
			tileSubtractCandidates.push(rightTile);
		}
	}

	var numAnchorTiles = 20;
	for (var i = 0; i < 14; i++) {
		var randIndex = Math.floor(Math.random() * tileSubtractCandidates.length);
		var randTile = tileSubtractCandidates[randIndex];
		removeArrayValueAtIndex(tileSubtractCandidates, randIndex);
		tileSubtractCandidatesUsed.push(randTile);
	}
}

function removeRandomCandidate() {
	if (tileSubtractCandidates.length == 0) {
		console.log("NO CANDIDATES LEFT");
		return;
	}
	var randomTileNumber = Math.floor(Math.random() * tileSubtractCandidates.length);
	var randomTile = tileSubtractCandidates[randomTileNumber];

	var randomTileEdges = getTileEdges(randomTile);
	//track horizontal/vertical lines that are "on" around the potential new tile
	//if the difference between h and v lines on are exactly 2, we cannot use this and have to redo
	var hOn = 0;
	var vOn = 0;
	for (var i = 0; i < randomTileEdges.length; i++) {
		var state = getLineState(randomTileEdges[i]);
		var lineType = randomTileEdges[i].attr("id").split(DEL)[0];
		if (state == "on") {
			setLineState(randomTileEdges[i], "dormant");
			if (lineType == "h") {
				hOn++;
			} else if (lineType == "v") {
				vOn++;
			} else {
				alert("line has invalid type somehow");
			}
		} else {
			setLineState(randomTileEdges[i], "on");
		}
	}

	if (checkLineCountAtVertices() && Math.abs(hOn - vOn) != 2) {
		//add new potential subtraction tiles, avoid previously used tiles or tiles already in the list
		var newPotentialCandidates = getAdjacentTiles(randomTile);
		for (var i = 0; i < newPotentialCandidates.length; i++) {
			if (!tileIdExistsInArray(newPotentialCandidates[i].attr("id"), tileSubtractCandidates)) {
				if (!tileIdExistsInArray(newPotentialCandidates[i].attr("id"), tileSubtractCandidatesUsed)) {
					tileSubtractCandidates.push(newPotentialCandidates[i]);
				}
			}
		}
	} else {
		for (var i = 0; i < randomTileEdges.length; i++) {
			var state = getLineState(randomTileEdges[i]);
			if (state == "dormant") {
				setLineState(randomTileEdges[i], "on");
			} else {
				setLineState(randomTileEdges[i], "dormant");
			}
		}
	}

	removeArrayValueAtIndex(tileSubtractCandidates, randomTileNumber);
	tileSubtractCandidatesUsed.push(randomTile);
}

//removes an index from an array, returning the value at that index
function removeArrayValueAtIndex(array, index) {
	if (index > array.length) {
		return;
	}

	for (var i = 0; i < array.length - 1; i++) {
		if (i >= index) {
			array[i] = array[i+1];
		}
	}

	array.pop();
}

//check to see if the passed tile id is represented in an array of tiles
function tileIdExistsInArray(tileId, array) {
		for (var i = 0; i < array.length; i++) {
			var nextTileId = array[i].attr("id");
			if (tileId == nextTileId) {
				return true;
			}
		}
		return false;
}

//check lines around each vertices, make sure there are never more than 2 because that would be invalid
function checkLineCountAtVertices() {
	for (var i = 1; i < ROWS; i++) {
		for (var k = 1; k < COLUMNS; k++) {
			var lineOnCount = 0;

			var rightLineState = getLineState($("#h" + DEL + i + DEL + k));
			var leftLineState = getLineState($("#h" + DEL + i + DEL + (k - 1)));
			var botLineState = getLineState($("#v" + DEL + i + DEL + k));
			var topLineState = getLineState($("#v" + DEL + (i - 1) + DEL + k));

			if (rightLineState == "on") {
				lineOnCount++;
			}
			if (leftLineState == "on") {
				lineOnCount++;
			}
			if (botLineState == "on") {
				lineOnCount++;
			}
			if (topLineState == "on") {
				lineOnCount++;
			}

			if (lineOnCount > 2) {
				return false;
				console.log("fail");
			}
		}
	}
	return true;
}

//generate and set a random grid
function testGenerateGrid() {
	//iteratively remove tiles from the edge, putting them back if they invalidate the shape
	for (var i = 0; i < 40; i++) {
		removeRandomCandidate();
	}

	//populate the grid with numbers based on the randomly generated loop
	for (var i = 0; i < ROWS; i++) {
		for (var k = 0; k < COLUMNS; k++) {
			var nextTile = $("#t" + DEL + i + DEL + k);
			var tileEdges = getTileEdges(nextTile);
			var lineOnCount = 0;
			for (var j = 0; j < tileEdges.length; j++) {
				if (getLineState(tileEdges[j]) == "on") {
					lineOnCount++;
				}
			}
			nextTile.text(lineOnCount);
			boardState_tiles[i][k] = lineOnCount;
		}
	}

	resetVisibleBoard();
}

//set all lines back to dormant
//clear all tile numbers
function resetVisibleBoard() {
	$(".tile").text("");

	$(".horizontal-line").each(function() {
		var el = $(this);
		setLineState(el, "dormant");
	});

	$(".vertical-line").each(function() {
		var el = $(this);
		setLineState(el, "dormant");
	});
}

function checkForGameEnd() {
	var gameWon = true;
	for (var currentRow = 0; currentRow < ROWS; currentRow++) {
		for (var currentCol = 0; currentCol < COLUMNS; currentCol++) {
			var nextTile = $("#t" + DEL + currentRow + DEL + currentCol);
			var nextTileEdges = getTileEdges(nextTile);
			var onCount = 0;
			for (var i = 0; i < nextTileEdges.length; i++) {
				if (nextTileEdges[i].hasClass("line-on")) {
					onCount++;
				}
			}
			if (onCount != boardState_tiles[currentRow][currentCol]) {
				gameWon = false;
			}
		}
	}
	if (gameWon) {
		alert("you win!");
	}
}
