$(window).on('load', function(){
    var sectionToShow = "studio"
    $("#sections-block").children().each(function(){
        var curId =  $(this).attr('id')
        console.log(curId)
        if (sectionToShow == curId){
            $(this).show();
            $("#"+curId+"-btn").css('font-weight','bolder')
        }else{
            $(this).hide();
            $("#"+curId+"-btn").css('font-weight','normal')
        }
    })
})

$(document).on('click', '.menu-item', function (){
    var clickedId = $(this).attr('id').slice(0,-4);
    $("#sections-block").children().each(function(){
        var curId =  $(this).attr('id')
        console.log(curId)
        console.log(clickedId)
        if (clickedId == curId){
            console.log(clickedId)
            $(this).show();
            $("#"+curId+"-btn").css('font-weight','bolder')
        }else{
            $(this).hide();
            $("#"+curId+"-btn").css('font-weight','normal')
        }
    })
})

