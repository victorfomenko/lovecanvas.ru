app.controller("galleryController", function($scope, appService){
    $scope.$on("$stateChangeSuccess", function(){
        $(window).resize();
        setTimeout(collageCaption, 200);
    });

    appService.getImageList(40).then(function(){
        $scope.pictures = appService.pictures;
    });

    // This is just for the case that the browser window is resized
    var resizeTimer = null;
    $(window).bind('resize', function() {
        // hide all the images until we resize them
        $('.gallery .Image_Wrapper').css("opacity", 0);
        // set a timer to re-apply the plugin
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(collage, 200);
    });

    // Here we apply the actual CollagePlus plugin
    function collage() {
        $('.gallery').collagePlus(
            {
                'fadeSpeed'     : 1000,
                'targetHeight'  : 200
            }
        );
    }
    function collageCaption(){
        $('.gallery').collageCaption();
    }
});