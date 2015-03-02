(function() {
    app.controller('ApplicationController', function ($rootScope, $scope,
                                                      AUTH_EVENTS,
                                                      USER_ROLES,
                                                      AuthService, $cookies) {

        // user authentication data
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        if($cookies.PHPSESSID){ //if session is exist get user data from server
            AuthService.loginOnRefreshPage().then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(user);
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        }

    })
}).call(this);