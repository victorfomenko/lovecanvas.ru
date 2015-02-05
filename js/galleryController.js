app.controller("galleryController", function($scope,$timeout, appService){

    appService.getImageList(40).then(function(){
        $scope.pictures = appService.pictures;
        $timeout(collage, 200);
        $timeout(caption, 0);
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
                'targetHeight':   250,
                'allowPartialLastRow': true
            }
        );
    }
    function caption() {
        $('.gallery').collageCaption();
    }
});