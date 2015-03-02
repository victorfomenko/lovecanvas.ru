app.controller('loginController', function ($scope, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService) {

    $scope.credentials = {
        'email': '',
        'password': '',
        'rememberMe': true
    };
    console.log($scope.currentUser);
    console.log($scope.userRoles.user);
    console.log($scope.isAuthorized($scope.userRoles.user));
    $scope.login = function (credentials) {

        //do not login if already login
        if(AuthService.isAuthenticated()) return;

        //start login
        AuthService.login(credentials).then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });

    };

    $scope.logout = function () {
        AuthService.logout().then(function (user) {
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            $scope.setCurrentUser(user);
        });
    };

});
