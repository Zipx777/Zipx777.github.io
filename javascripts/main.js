//keeps track of whether X or O is next, starts with X
var nextMove = "X";

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
        $(this).children().each(function(n) {
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
        if (checkForBattleWin($(this).parent())) {
            //alert(nextMove + " won a battle");
        }
        identifyNextPlayableSquare($(this));
        updateNextMoveVar();
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
    if (squareIsFull(nextSquareObj)) {
        $(".tictactoesquare").addClass("playable");
    } else {
        nextSquareObj.addClass("playable");   
    }
}

//returns true if every tile in the square has a letter in it
function squareIsFull(square) {
    var firstTile = square.children().first();
    var currentTile = firstTile;

    //loop through all tiles in this tictactoe board, return false if any space is empty
    var i;
    for (i = 0; i < 9; i++) {
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
}

//checks to see if current player won one of the tictactoe squares
//returns true if the current player won the square by having 3 in a row
function checkForBattleWin(square) {
    var firstTile = square.children().first();
    var currentTile = firstTile;
    var playerHasTile = [];
    var i;

    //loop through all tiles in this tictactoe board, record which spaces current player has
    for (i = 0; i < 9; i++) {
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

//reset game state to start
function resetClick() {
    var squares = $(".tictactoesquare");
    var currentSquare = squares.first();
    
    var i;
    for (i = 0; i < 9; i++) {
        //make sure every square has one copy of the playable class
        currentSquare.removeClass("playable");
        currentSquare.addClass("playable");
        
        //reset tile text to be blank
        /*
        var currentTile = currentSquare.first();
        var j;
        for (j = 0; j < 9; j++) {
            currentTile.text("");
            currentTile = currentTile.next();
        }
        */
        currentSquare = currentSquare.next()
    }
}
