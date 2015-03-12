app.controller('profileController', function ($scope, $http, $state, USER_ROLES, AuthService) {

    var userURL = $state.params.artistId;
    var requestUrl = '/ajax/ajax.php?act=artist&userurl=' + userURL;
    var result;
    $scope.dropzoneConfig = {
        parallelUploads: 1,
        maxFilesize: 24,
        dictDefaultMessage: "Изменить фото",
        dictInvalidFileType: "Тип файла не поддерживается",
        clickable: true,
        uploadMultiple: false
    };
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
                $scope.user.avatar = 'noavatar';
            }
        });
});