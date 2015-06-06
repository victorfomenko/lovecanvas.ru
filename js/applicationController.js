(function() {
    app.controller('ApplicationController', function ($rootScope, $scope,
                                                      AUTH_EVENTS,
                                                      USER_ROLES,
                                                      AuthService, $location,
                                                      $cookies) {
        var loginModalLink =    'modal-login',
            registerModalLink = 'modal-register';

        // user authentication data
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;


        //set error message by default
        $scope.note = {
            type: {
                info: 'info',
                error: 'info--error'
            },
            class: null,
            message: null
        };

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

        $scope.restoreUrl = function(){
            $location.hash('');
        };
        //open, close modal windows
        $scope.$watch(function(){
            return $location.hash();
        }, function(){
            var hash = $location.hash();
            if (hash == loginModalLink) {
                $('#' + loginModalLink).modal('show');
                $('#' + registerModalLink).modal('hide');
            }
            else if (hash == registerModalLink) {
                $('#' + registerModalLink).modal('show');
                $('#' + loginModalLink).modal('hide');
            }
            else if(!hash) {
                $('#' + loginModalLink).modal('hide');
                $('#' + registerModalLink).modal('hide');
            }
        });
    })
}).call(this);