//keeps track of whether X or O is next, starts with X
var nextMove = "X";
var tieGameOver = false;

//document ready function
$(function(){
    $(".tile").mouseover(tileMouseover);
    $(".tile").mouseout(tileMouseout);
    $(".tile").click(tileClick);
    $("#resetButton").click(resetClick);
    prepareGameBoard();
});

//setup IDs on squares and tiles, set all squares to playable to start
//the IDs are used to determine which square the player has to play on next
function prepareGameBoard() {
    $(".tictactoesquare").each(function(i) {
        $(this).addClass("playable");
        $(this).attr("id", "square" + i);
        $(this).children(".tile").each(function(n) {
            $(this).attr("id", "tile" + i + "" + n);
        });
    });
    $("#turnIndicator").text(nextMove);
}

//mouse moves onto a tile
function tileMouseover() {
    if (tileIsValidMove($(this))) {
        $(this).css("background-color", "lightgreen");
        $(this).css("border", "4px solid green");
    } else {
        $(this).css("background-color", "lightcoral");
        $(this).css("border", "4px solid red");
    }
}

//mouse leaves a tile, reset color and border
function tileMouseout() {
    $(this).css("background-color", "white");
    $(this).css("border", "4px solid black");
}

//the player clicked on a tile
function tileClick() {
    if (tileIsValidMove($(this))) {
        $(this).text(nextMove);
        var square = $(this).parent();
        if (checkForBattleWin(square)) {
            //someone won a square, hide the tiles and display a big X or O
            square.children(".tile").hide();
            square.addClass("wonSquare");
            
            var squareWonTile = square.children(".squareWonTile");
            squareWonTile.text(nextMove);
            squareWonTile.show();
            var gameStateWin = checkForGameWin();
            if (gameStateWin) {
                finishGame(gameStateWin);
                return;
            }
        }
        identifyNextPlayableSquare($(this));
        updateNextMoveVar();
    } else {
        //this case only comes up if player clicks on the tile the previous player just marked
        $(this).css("background-color", "lightcoral");
        $(this).css("border", "4px solid red");
    }
}

/*
Figures out which square or squares are playable next turn using the tile that was marked last turn
The tile the player put their mark in indicates which square will be playable
If this points to a full square, the player can play on any square
Assigns playable class to those ones, removes it from others
*/
function identifyNextPlayableSquare(tile) {
    var tileID = tile.attr("id");
    var nextSquareNum = tileID.charAt(5);
    var nextSquareID = "square" + nextSquareNum;
    var nextSquareObj = $("#" + nextSquareID);
    
    $(".tictactoesquare").removeClass("playable");
    if (nextSquareObj.hasClass("wonSquare") || squareIsFull(nextSquareObj)) {
        //loop through all squares, mark each square that isn't full or won as playable
		var allSquaresFull = true;
        $(".tictactoesquare").each(function() {
            if (!($(this).hasClass("wonSquare")) && !(squareIsFull($(this)))) {
                $(this).addClass("playable");
				allSquaresFull = false;
            }
        });
		
		if (allSquaresFull) {
			tieGameOver = true;			
		}
    } else {
        nextSquareObj.addClass("playable");   
    }
}

//returns true if every tile in the square has a letter in it
function squareIsFull(square) {
    var tiles = square.children(".tile");
    var currentTile = tiles.first();

    //loop through all tiles in this tictactoe board, return false if any space is empty
    var i;
    for (i = 0; i < tiles.length; i++) {
        if (currentTile.text() == "") {
            return false;
        }
        currentTile = currentTile.next();
    }
    
    //gets here if every tile in the square had a mark in it
    return true;
}

//returns true if tile is a valid move for current player
function tileIsValidMove(tile) {
    if (tile.text() == "") {
        if (tile.parent().hasClass("playable")) {
            return true;
        }
    }
    return false;
}

//change next move to opposite of what it was this turn
//always call this last when used in other functions
function updateNextMoveVar() {
    if (nextMove == "X") {
        nextMove = "O";
    } else {
        nextMove = "X";
    }
    $("#turnIndicator").text(nextMove);
	if (tieGameOver) {
		$("#turnIndicator").text("Tie Game");
		$("#turnIndicatorText").text("");
	}
}

//checks to see if current player won one of the tictactoe squares
//returns true if the current player won the square by having 3 in a row
function checkForBattleWin(square) {
    var tiles = square.children(".tile");
    var currentTile = tiles.first();
    var playerHasTile = [];
    var i;

    //loop through all tiles in this tictactoe board, record which spaces current player has
    for (i = 0; i < tiles.length; i++) {
        if (currentTile.text() == nextMove) {
            playerHasTile[i] = true;
        } else {
            playerHasTile[i] = false;
        }
        currentTile = currentTile.next();
    }
    
    //look for win conditions for current player
    var playerWon = false;
    if (playerHasTile[4]) {
        if (playerHasTile[0] && playerHasTile[8]) {
            playerWon = true;
        }
        if (playerHasTile[1] && playerHasTile[7]) {
            playerWon = true;
        }
        if (playerHasTile[2] && playerHasTile[6]) {
            playerWon = true;
        }
        if (playerHasTile[3] && playerHasTile[5]) {
            playerWon = true;
        }
    }
    
    if (playerHasTile[0]) {
        if (playerHasTile[3] && playerHasTile[6]) {
            playerWon = true;
        }
        if (playerHasTile[1] && playerHasTile[2]) {
            playerWon = true;
        }
    }
    
    if (playerHasTile[8]) {
        if (playerHasTile[2] && playerHasTile[5]) {
            playerWon = true;
        }
        if (playerHasTile[6] && playerHasTile[7]) {
            playerWon = true;
        }
    }
    
    return playerWon;
}

//return true if current player has won the entire game
function checkForGameWin() {
    var squares = $(".tictactoesquare");
    var currentSquare = squares.first();
    var playerHasSquare = [];
    var i;
    
    //loop through all the squares, record which squares the current player has 
    for (i = 0; i < squares.length; i++) {
        if ((currentSquare.hasClass("wonSquare")) && (currentSquare.children(".squareWonTile").first().text() == nextMove)) {
            playerHasSquare[i] = true;
        } else {
            playerHasSquare[i] = false;
        }
        currentSquare = currentSquare.next();
    }
    
    return checkForThreeInARow(playerHasSquare);
}

//returns a string representing which tiles caused the win, or blank if no win
//array represents 3x3 square of tiles left to right, top to bottom
function checkForThreeInARow(playerHasTile) {
    var threeInARow = "";
    if (playerHasTile[4]) {
        if (playerHasTile[0] && playerHasTile[8]) {
            threeInARow = "048";
        }
        if (playerHasTile[1] && playerHasTile[7]) {
            threeInARow = "147";
        }
        if (playerHasTile[2] && playerHasTile[6]) {
            threeInARow = "246";
        }
        if (playerHasTile[3] && playerHasTile[5]) {
            threeInARow = "345";
        }
    }
    
    if (playerHasTile[0]) {
        if (playerHasTile[3] && playerHasTile[6]) {
            threeInARow = "036";
        }
        if (playerHasTile[1] && playerHasTile[2]) {
            threeInARow = "012";
        }
    }
    
    if (playerHasTile[8]) {
        if (playerHasTile[2] && playerHasTile[5]) {
            threeInARow = "258";
        }
        if (playerHasTile[6] && playerHasTile[7]) {
            threeInARow = "678";
        }
    }
    
    return threeInARow;
}

//marks winning tiles
function finishGame(gameStateWin) {
    $(".tictactoesquare").removeClass("playable");
    var i;
    for (i = 0; i < gameStateWin.length; i++) {
        var squareNum = gameStateWin.charAt(i);
        var squareID = "square" + squareNum;
        $("#" + squareID).addClass("finalSquare");
    }
    $("#turnIndicatorText").text(" won!");
}

//reset game state to start
function resetClick() {
    var squareWonTiles = $(".squareWonTile");
    squareWonTiles.hide();
    squareWonTiles.text("");
    
	tieGameOver = false;
	
    var squares = $(".tictactoesquare");
    squares.removeClass("playable");
    squares.removeClass("finalSquare");
    squares.addClass("playable");
    squares.removeClass("wonSquare");
    
    squares.each(function() {
        var tiles = $(this).children(".tile"); 
        tiles.text("");
        tiles.show();
    });
    
	$("#turnIndicator").text(nextMove);
    $("#turnIndicatorText").text("s Turn");
}
