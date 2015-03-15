app.controller('profileController', function ($scope, $http, $state, Session, USER_ROLES, AuthService) {
    $scope.isHidden = true;
    var userURL = $state.params.artistId;
    $scope.dropzoneConfig = {
        url: '/ajax/ajax.php?act=avatarSave&urlname=' + userURL,
        acceptedFiles: 'image/jpeg',
        parallelUploads: 1,
        maxFilesize: 24,
        dictDefaultMessage: "Изменить фото",
        dictInvalidFileType: "Тип файла не поддерживается",
        clickable: ".dz-select",
        uploadMultiple: false,
        autoQueue: false,
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img class='user-avatar' data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><small class=\" m-text_error\" data-dz-errormessage></small></div>",
        previewsContainer: '.dropzone-previews',
        init: function() {
            this.on("addedfile", function(file) {
                // Hookup the start button
                document.querySelector(".dz-start").onclick = function() { $scope.dropzone.enqueueFile(file); };
                $scope.isHidden = false;
                $scope.$apply();
            });
            this.on("totaluploadprogress", function(progress) {
                //document.querySelector(".dz-upload").style.width = progress + "%";
            });

            this.on("sending", function(file) {
                // Show the total progress bar when upload starts
                document.querySelector(".dz-progress").style.opacity = "1";
                // And disable the start button
                document.querySelector(".dz-start").setAttribute("disabled", "disabled");
            });

            // Hide the total progress bar when nothing's uploading anymore
            this.on("queuecomplete", function(progress) {
                //document.querySelector(".dz-progress").style.opacity = "0";
            });

            // Hide the total progress bar when nothing's uploading anymore
            this.on("success", function(file, response) {
                document.querySelector(".dz-start").removeAttribute("disabled");
                $scope.user.avatar = response.user.avatar;
                $scope.dropzone.removeAllFiles(true);
                $scope.isHidden = true;
                $scope.$apply();
            });

            // Setup the buttons for all transfers
            // The "add files" button doesn't need to be setup because the config
            // `clickable` has already been specified.
            document.querySelector("#dz-actions .dz-start").onclick = function() {
                $scope.dropzone.enqueueFiles(this.getFilesWithStatus(Dropzone.ADDED));
            };
            document.querySelector("#dz-actions .dz-cancel").onclick = function() {
                $scope.isHidden = true;
                $scope.$apply();
                $scope.dropzone.removeAllFiles(true);
            };

        }
    };


    var requestUrl = '/ajax/ajax.php?act=artist&userurl=' + userURL;
    var result;
    return $http.post(requestUrl)
        .success(function(data){
            if (typeof  data === 'object') {
                result = data;
            }
        })
        .error(function(data){
            console.log(data);
        }).then(function(){
            $scope.user = result.user;
            if(!result.user.avatar) {
                $scope.user.avatar = 'noavatar.jpg';
            }
        });
});