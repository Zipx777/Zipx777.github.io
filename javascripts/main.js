//document ready function
$(function(){
    $(".tile").mouseover(function() {
        $(this).css("background-color", "red");
    })
    
    $(".tile").mouseout(function() {
        $(this).css("background-color", "white");
    })
});
