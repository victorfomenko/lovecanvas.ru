app.controller('profileController', function ($scope, $http, $state, USER_ROLES, AuthService) {

    var userURL = $state.params.artistId;
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
                $scope.user.avatar = 'noavatar';
            }
        });
});