app.controller("mainController", function($scope, $state, appService){
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
                    $state.go('order').then(function(){
                        appService.dataForSent.image = e.target.result;
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
    }
});