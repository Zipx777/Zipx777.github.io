//document ready function
$(function(){
    $(".tile").mouseover(tileMouseover($(this)));
    $(".tile").mouseout(tileMouseout($(this)));
    /*
    $(".tile").mouseover(function() {
        $(this).css("background-color", "red");
    })
    
    $(".tile").mouseout(function() {
        $(this).css("background-color", "white");
    })
    */
});

//mouse moves onto a tile
function tileMouseover(tile) {
    $(tile).css("background-color", "red");
}

//mouse leaves a tile
function tileMouseout(tile) {
    $(tile).css("background-color", "white");
}
