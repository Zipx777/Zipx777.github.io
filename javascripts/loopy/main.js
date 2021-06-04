var rows,
		columns,
		del,
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
	rows = 7;
	columns = 7;

	//deliniator for element IDs on the grid
	del = "_";

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
	boardState_horizontalLines = new Array(rows + 1);
	for (var i = 0; i < rows + 1; i++) {
		boardState_horizontalLines[i] = new Array(columns);
	}

	boardState_verticalLines = new Array(rows);
	for (var i = 0; i < rows; i++) {
		boardState_verticalLines[i] = new Array(columns + 1);
	}
}

function initializeBoard() {
	//top
	for (var i = 0; i < columns; i++) {
		var newConnector = $("<div></div>");
		newConnector.addClass("connector-square");
		$("#loopyBoard").append(newConnector);

		var newHorizLine = $("<div></div>");
		newHorizLine.addClass("horizontal-line");
		newHorizLine.addClass("line-dormant");
		var idStr = "h" + del + "0" + del + i;
		newHorizLine.attr('id', idStr);
		$("#loopyBoard").append(newHorizLine);

		boardState_horizontalLines[0][i] = 0;
	}
	var newConnector = $("<div></div>");
	newConnector.addClass("connector-square");
	$("#loopyBoard").append(newConnector);

	//repeated body + bottom
	for (var i = 0; i < columns; i++) {
		for (var j = 0; j < rows; j++) {
			var newVertLine = $("<div></div>");
			newVertLine.addClass("vertical-line");
			newVertLine.addClass("line-dormant");
			var idStr = "v" + del + i + del + j;
			newVertLine.attr('id', idStr);
			$("#loopyBoard").append(newVertLine);

			boardState_verticalLines[i][j] = 0;

			var newTile = $("<div></div>");
			newTile.addClass("tile");
			newTile.attr("id", "t" + del + i + del + j);
			newTile.text(boardState_tiles[i][j]);
			$("#loopyBoard").append(newTile);
		}
		var newVertLine = $("<div></div>");
		newVertLine.addClass("vertical-line");
		newVertLine.addClass("line-dormant");
		newVertLine.attr('id', "v" + del + i + del + rows);
		$("#loopyBoard").append(newVertLine);

		boardState_verticalLines[i][rows] = 0;

		for (var j = 0; j < rows; j++) {
			var newConnector = $("<div></div>");
			newConnector.addClass("connector-square");
			$("#loopyBoard").append(newConnector);

			var newHorizLine = $("<div></div>");
			newHorizLine.addClass("horizontal-line");
			newHorizLine.addClass("line-dormant");
			newHorizLine.attr('id', "h" + del + (i + 1) + del + j);
			$("#loopyBoard").append(newHorizLine);

			boardState_horizontalLines[i + 1][j] = 0;
		}

		var newConnector = $("<div></div>");
		newConnector.addClass("connector-square");
		$("#loopyBoard").append(newConnector);
	}

	initiateLoopCreation();
}

//link events to their event handler functions
function setEventHandlers() {
	$(".horizontal-line").mousedown(lineClick);
	$(".vertical-line").mousedown(lineClick);
	$(".tile").mousedown(tileClick);
}

//if tile is a zero, QoL set all lines to off
function tileClick(event) {
		var tileNum = parseInt($(this).text());
		if (tileNum == 0) {
			var tileEdges = getTileEdges($(this));
			for (var i = 0; i < tileEdges.length; i++) {
				setLineState(tileEdges[i], "off");
			}
		}
}

function lineClick(event) {

	var id = $(this).attr('id');
	var idValues = id.split(del);
	var lineType = idValues[0];
	var lineX = parseInt(idValues[1]);
	var lineY = parseInt(idValues[2]);

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
		var tile1ToCheck = [lineX, lineY];
		var tile2ToCheck = [lineX - 1, lineY];
		if (lineX == 0) {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
		} else if (lineX == rows) {
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		} else {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		}
	} else if (lineType == "v") {
		var tile1ToCheck = [lineX, lineY];
		var tile2ToCheck = [lineX, lineY - 1];
		if (lineY == 0) {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
		} else if (lineY == columns) {
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		} else {
			tile1EdgesAreValid = tileEdgeCountIsValid(tile1ToCheck[0], tile1ToCheck[1]);
			tile2EdgesAreValid = tileEdgeCountIsValid(tile2ToCheck[0], tile2ToCheck[1]);
		}
	} else {
		alert("ahhhhhhhhhhhhhhhh");
	}

	var tile1ID = "#t" + del + tile1ToCheck[0] + del + tile1ToCheck[1];
	var tile2ID = "#t" + del + tile2ToCheck[0] + del + tile2ToCheck[1];
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
}

//returns an array of tiles cardinally adjacent to one
function getAdjacentTiles(tile) {
	var tileID = tile.attr("id");
	var idSplit = tileID.split(del);
	var tileX = parseInt(idSplit[1]);
	var tileY = parseInt(idSplit[2]);

	var adjacentTiles = [];

	var leftTileX = tileX - 1;
	var rightTileX = tileX + 1;
	var topTileY = tileY - 1;
	var botTileY = tileY + 1;

	if (leftTileX >= 0) {
		var leftTileId = "#t" + del + leftTileX + del + tileY;
		adjacentTiles.push($(leftTileId));
	}

	if (rightTileX < columns) {
		var rightTileId = "#t" + del + rightTileX + del + tileY;
		adjacentTiles.push($(rightTileId));
	}

	if (topTileY >= 0) {
		var topTileId = "#t" + del + tileX + del + topTileY;
		adjacentTiles.push($(topTileId));
	}

	if (botTileY < rows) {
		var botTileId = "#t" + del + tileX + del + botTileY;
		adjacentTiles.push($(botTileId));
	}

	return adjacentTiles;
}

//returns an array with the 4 edges surrounding a tile
function getTileEdges(tile) {
	var tileID = tile.attr("id");
	var idSplit = tileID.split(del);
	var tileX = parseInt(idSplit[1]);
	var tileY = parseInt(idSplit[2]);

	var vEdge1 = $("#v" + del + tileX + del + tileY);
	var vEdge2 = $("#v" + del + tileX + del + (tileY + 1));
	var hEdge1 = $("#h" + del + tileX + del + tileY);
	var hEdge2 = $("#h" + del + (tileX + 1) + del + tileY);

	var edges = [vEdge1, vEdge2, hEdge1, hEdge2];
	return edges;
}

//return true if tile has equal or less edges filled in
//return false if tile has more edges filled in than its number
//return false if too many lines have been made dormant
function tileEdgeCountIsValid(x,y) {
	x = parseInt(x);
	y = parseInt(y);

	var tileElement = $("#t" + del + x + del + y);
	var tileNum = tileElement.text();

	var committedCount = 0;
	var availableCount = 0;

	var edgeValues = [
		boardState_horizontalLines[x][y],
		boardState_horizontalLines[(x+1)][y],
		boardState_verticalLines[x][y],
		boardState_verticalLines[x][(y+1)]
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
	var idSplit = lineID.split(del);
	var lineType = idSplit[0];
	var lineX = parseInt(idSplit[1]);
	var lineY = parseInt(idSplit[2]);
	var lineArray;
	if (lineType == "h") {
		lineArray = boardState_horizontalLines;
	} else if (lineType == "v") {
		lineArray = boardState_verticalLines;
	}

	var state = lineArray[lineX][lineY];
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
	var idSplit = lineID.split(del);
	var lineType = idSplit[0];
	var lineX = parseInt(idSplit[1]);
	var lineY = parseInt(idSplit[2]);
	var lineArray;
	if (lineType == "h") {
		lineArray = boardState_horizontalLines;
	} else if (lineType == "v") {
		lineArray = boardState_verticalLines;
	}

	lineArray[lineX][lineY] = stateNum;
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
		var hTopLine = $("#h" + del + "0" + del + i);
		var topTile = $("#t" + del + "0" + del + i);
		setLineState(hTopLine, "on");

		var hBotLine = $("#h" + del + (boardState_horizontalLines.length - 1) + del + i);
		var botTile = $("#t" + del + (boardState_horizontalLines.length - 2) + del + i)
		setLineState(hBotLine, "on");

		tileSubtractCandidates.push(topTile);
		tileSubtractCandidates.push(botTile);
	}

	for (var i = 0; i < boardState_verticalLines.length; i++) {
		var vLeftLine = $("#v" + del + i + del + "0");
		var leftTile = $("#t" + del + i + del + "0");
		setLineState(vLeftLine, "on");

		var vRightLine = $("#v" + del + i + del + (boardState_verticalLines[0].length - 1));
		var rightTile = $("#t" + del + i + del + (boardState_verticalLines[0].length - 2));
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
	//it would split the board if
	var hOn = 0;
	var vOn = 0;
	for (var i = 0; i < randomTileEdges.length; i++) {
		var state = getLineState(randomTileEdges[i]);
		var lineType = randomTileEdges[i].attr("id").split(del)[0];
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
	for (var i = 1; i < rows; i++) {
		for (var k = 1; k < columns; k++) {
			var lineOnCount = 0;

			var rightLineState = getLineState($("#h" + del + i + del + k));
			var leftLineState = getLineState($("#h" + del + i + del + (k - 1)));
			var botLineState = getLineState($("#v" + del + i + del + k));
			var topLineState = getLineState($("#v" + del + (i - 1) + del + k));

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
	for (var i = 0; i < rows; i++) {
		for (var k = 0; k < columns; k++) {
			var nextTile = $("#t" + del + i + del + k);
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
}

function test2() {
	var randX = Math.floor(Math.random() * columns);
	var randY = Math.floor(Math.random() * rows);
	var saveVar = boardState_tiles[randX][randY];
	$("#t" + del + randX + del + randY).text("");
	boardState_tiles[randX][randY] = "";


}

function validateBoardComplete() {
	var verticesValid = checkLineCountAtVertices();
}
