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
        $(this).css("border", "5px solid green");
    } else {
        $(this).css("background-color", "lightcoral");
        $(this).css("border", "5px solid red");
    }
}

//mouse leaves a tile, reset color and border
function tileMouseout() {
    $(this).css("background-color", "white");
    $(this).css("border", "5px solid black");
}

function tileClick() {
    var tileText = $(this).text();
    if (tileText == "") {
        $(this).text(nextMove);
        updateNextMoveVar();
    }
}

function updateNextMoveVar() {
    if (nextMove == "X") {
        nextMove = "O";
    } else {
        nextMove = "X";
    }
}
