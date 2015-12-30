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
    } else {
        $(this).css("background-color", "lightcoral");
    }
}

//mouse leaves a tile
function tileMouseout() {
    $(this).css("background-color", "white");
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
