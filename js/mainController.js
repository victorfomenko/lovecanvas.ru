app.controller("mainController", function($scope, $http, $state, appService, $timeout){
    $scope.bannerNumber = Math.floor((Math.random() * 4) + 1);

    $scope.openLoadFile = function(){
        var fileButton = document.getElementById('load-file');
        fileButton.click();
        fileButton.addEventListener('change', handleFileSelect, false);
        function handleFileSelect(evt) {
            var file = evt.target.files; // FileList object
            // Only process image files.
            if (!file[0].type.match('image.*')) {
                return;
            }
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    var image = new Image();
                    image.src = e.target.result;
                    appService.imageProp = image.width/image.height;
                    $state.go('canvas').then(function(){
                        appService.dataForSent.image = null;
                        appService.dataForSent.imageBase64 = e.target.result;
                        // Render thumbnail.
                        var imageContainer = document.getElementById('image-container');
                        imageContainer.style.backgroundImage=['url("', e.target.result ,'")'].join('');
                        imageContainer.innerHTML = ['<img class="product__image__img" id="mainPicture" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                    });
                };
            })(file[0]);

            // Read in the image file as a data URL.
            reader.readAsDataURL(file[0]);
        }
    };

    appService.getImageList(13).then(function(){
        $scope.pictures = appService.pictures;
        $timeout(collage, 200);
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
                'fadeSpeed'     : 500,
                'targetHeight'  : 200
            }
        ).collageCaption();
    }
});