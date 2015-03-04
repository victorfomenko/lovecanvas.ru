(function(){
    app.factory('AuthService', function ($http, Session, $cookies, $cookieStore, USER_ROLES) {
        var authService = {};

        authService.login = function (credentials) {
            var ajaxURL =   '/ajax/ajax.php?act=login' +
                            '&email=' + credentials.email +
                            '&password=' + credentials.password;
            if (credentials.rememberMe )  ajaxURL += '&remember-me=' + credentials.rememberMe;

            return $http
                .post(ajaxURL, credentials)
                .then(function (res) {
                    if(res.data.status === 'err') return false;
                    Session.create(res.data.id, res.data.user.id,
                        res.data.user.role);
                    return res.data.user;
                });
        };

        authService.loginOnRefreshPage = function () {
            var sid = $cookies.PHPSESSID;
            if(!sid) return false;
            var ajaxUrl =   '/ajax/ajax.php?act=profile';
            return $http
                .post(ajaxUrl)
                .then(function (res) {
                    if(res.data.status === 'err') return false;
                    Session.create(res.data.id, res.data.user.id,
                        res.data.user.role);
                    return res.data.user;
                });
        };

        authService.logout = function () {

            //clear cookies
            $cookieStore.remove('sid');

            //clear session on the server
            var ajaxUrl =   '/ajax/ajax.php?act=logout';
            return $http
                .post(ajaxUrl)
                .then(function (res) {
                    console.log(res);
                    if(res.data.status === 'err') return false;
                    Session.destroy();
                    return null;
                });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        return authService;
    })
}).call(this);