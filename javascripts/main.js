//keeps track of whether X or O is next, starts with X
var nextMove = "X";

//document ready function
$(function(){
    $(".tile").mouseover(tileMouseover);
    $(".tile").mouseout(tileMouseout);
    $(".tile").click(tileClick);
});

//mouse moves onto a tile
function tileMouseover() {
    var tileText = $(this).text();
    if (tileText == "") {
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
    var tile = $(this);
    alert("1");
    var tileText = tile.text();
    if (tileText == "") {
        tile.text(nextMove);
        if (checkForBattleWin(tile.parent())) {
            alert("3");
            alert(nextMove + " won a battle");
        }
        updateNextMoveVar();
    }
}

//change next move to opposite of what it was this turn
//always call this last when used in other functions
function updateNextMoveVar() {
    if (nextMove == "X") {
        nextMove = "O";
    } else {
        nextMove = "X";
    }
}

//checks to see if current player won one of the tictactoe squares
//returns true if the current player won the square by having 3 in a row
function checkForBattleWin(square) {
    alert("2");
    var tiles = square.children();
    var playerHasTile;
    var i;
    for (i = 0; i < tiles.length i++) {
        if (tiles[i].text() == nextMove) {
            playerHasTile[i] = true;
        } else {
            playerHasTile[i] = false;
        }
    }
    
    var playerWon = false:
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
