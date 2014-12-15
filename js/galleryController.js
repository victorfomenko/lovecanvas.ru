app.controller("galleryController", function($scope,$timeout, appService){

    appService.getImageList(40).then(function(){
        $scope.pictures = appService.pictures;
    });

    $scope.initPlugin = function(){
        imageInit()
    };
    var imageInit = _.debounce(function(){
        console.log('123');
        collage();
        collageCaption();
    }, 500);

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