//document ready function
$(function(){
    $(".tile").mouseover(tileMouseover);
    $(".tile").mouseout(tileMouseout);
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
function tileMouseover() {
    $(this).css("background-color", "red");
}

//mouse leaves a tile
function tileMouseout(tile) {
    $(this).css("background-color", "white");
}
