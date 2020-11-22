/*Anime scroll jquery  */
(function(){
    var $target  = $('.passjquery'),
        animationClass = 'anime-start'
        offset =$(window).height() *3/4;
    
    function animeScroll(){
        var documentTop = $(document).scrollTop();
        $target.each(function(){
            var itemTop = $(this).offset().top;
            if(documentTop>itemTop -500){
                $(this).addClass(animationClass)
    
            }else{
                $(this).removeClass(animationClass); 
            }
        })
    }
    animeScroll();
    
    $(document).scroll(function(){
        animeScroll();
    })
    
    }()); 