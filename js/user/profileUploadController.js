app.controller('profileUploadController', function ($scope, $state, $rootScope) {
    var userURL = $state.params.artistId,
        unuploadedFiles = '';
    var previewTemplate =   '<li class="dz-preview dz-preview--art dz-image-preview">' +
                                '<a href="#" class="dz-details beaker-tabs-link">' +
                                    '<div class="dz-mask"></div>' +
                                    '<div class="dz-filename">' +
                                        '<span data-dz-name=""></span>' +
                                    '</div>' +
                                    '<div class="dz-size" data-dz-size="">' +
                                        '<strong></strong> MiB' +
                                    '</div>' +
                                    '<img data-dz-thumbnail class="m-landscape" >' +
                                '</a>' +
                                '<div class="dz-progress">' +
                                    '<span class="dz-upload" data-dz-uploadprogress=""></span>' +
                                '</div>' +
                                '<div class="dz-success-mark"><span>Успех</span></div>' +
                                '<div class="dz-error-mark"><span>Ошибка</span></div>' +
                                '<div class="dz-error-message"><span data-dz-errormessage=""></span></div>' +
                                '<a class="dz-remove" href="javascript:undefined;" data-dz-remove="">Удалить</a>' +
                            '</li>';

    $scope.dropzoneConfig = {
        url: '/ajax/ajax.php?act=avatarSave&urlname=' + userURL,
        maxFilesize: 25,
        maxFiles: 5,
        previewTemplate: previewTemplate,
        acceptedFiles: 'image/jpeg, image/png',
        uploadMultiple: true,
        previewsContainer: '.dropzone-previews',
        thumbnailWidth: 800,
        thumbnailHeight: null,
        autoProcessQueue: false,
        maxThumbnailFilesize: 25,
        clickable: ['#artDZ', '#uploadArtBtn'],
        init: function() {
            this.on("addedfile", function(file) {
                $('#uploadTabs').find('.m-hidden').removeClass('m-hidden');
                $('#goToDescriptionArt').removeClass('m-hidden');
            });
            this.on("maxfilesreached", function(file) {
                $('#uploadArtBtn').addClass('m-hidden');
            });
            this.on("maxfilesexceeded", function(file) {

                //error notification
                unuploadedFiles ? unuploadedFiles += ', ' : false;
                unuploadedFiles += file.name;

                $scope.note.message = 'Ошибка загрузки ' + unuploadedFiles + '. Максимальное количество файлов — ' + $scope.dropzoneConfig.maxFiles;
                $scope.note.class = $scope.note.type.error;

                //apply scope
                $scope.$apply();

                //remove file from sanding array
                this.removeFile(file);

            });
            this.on("removedfile", function(file){
                var dropzone =      $scope.dropzone,
                    files =         dropzone.getQueuedFiles(),
                    maxFiles =      dropzone.options.maxFiles;

                if (files.length == 0) {
                    $('#uploadArtBtn').addClass('m-hidden');
                    $('#goToDescriptionArt').addClass('m-hidden');
                }
                else if(files.length < maxFiles) {
                    $('#uploadArtBtn').removeClass('m-hidden');
                    $('#goToDescriptionArt').removeClass('m-hidden');
                }

            })
        }
    };
    $scope.startUpload = function(){
        console.log('startUpload');
        $scope.dropzone.processQueue();
    };
});