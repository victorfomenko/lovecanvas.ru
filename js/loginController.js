app.controller('loginController', function ($scope, $rootScope, AUTH_EVENTS, USER_ROLES, AuthService) {

    $scope.credentials = {
        'email': '',
        'password': '',
        'rememberMe': true
    };

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
