var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'ngCookies' ]);

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});
app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    user: 'user',
    guest: 'guest'
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $locationProvider.hashPrefix('!'); //Hashbang goes for compatibility with browsers that do not support html5 urls.
    $urlRouterProvider.when('', '/');

    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: "templates/home.html",
            controller: "mainController",
            data : {
                pageTitle: 'Интернет-магазин картин. Печать фото на холсте',
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('wedding', {
            url: "/wedding",
            templateUrl: "/templates/wedding.html",
            controller: "mainController",
            data : { pageTitle: 'Печать свадебных фото' }
        })
        .state('canvas', {
            url: "/canvas",
            templateUrl: "/templates/canvas.html",
            controller: "canvasController",
            data : { pageTitle: 'Картина' }
        })
        .state('shipping', {
            url: "/shipping",
            templateUrl: "/templates/shipping.html",
            controller: "shippingController",
            data : { pageTitle: 'Заказ' }
        })
        .state('delivery', {
            url: "/delivery",
            templateUrl: "/templates/delivery.html",
            controller: "deliveryController",
            data : { pageTitle: 'Доставка' }
        })
        .state('price', {
            url: "/price",
            templateUrl: "/templates/price.html",
            controller: "priceController",
            data : {
                pageTitle: 'Цены',
                className: 'price-bg'
            }
        })
        .state('gallery', {
            url: "/gallery",
            templateUrl: "/templates/gallery.html",
            controller: "galleryController",
            data : {
                pageTitle: 'Галерея'
            }
        })
        .state('product', {
            url: "/gallery/:productId",
            templateUrl: "/templates/product.html",
            controller: "productController",
            data: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "/templates/login.html",
            controller: "loginController",
            data: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('artist', {
            url: "/:artistId",
            templateUrl: "/templates/artist.html",
            controller: "artistController",
            data: {
                authorizedRoles: [USER_ROLES.all, USER_ROLES.user]
            }
        })
        .state('profile', {
            url: "/:artistId/profile",
            templateUrl: "/templates/user/profile.html",
            controller: "profileController",
            data: {
                authorizedRoles: [ USER_ROLES.all, USER_ROLES.user, USER_ROLES.admin ]
            }
        })
        .state('profile.edit', {
            url: "/edit",
            views: {
                "profile": {
                    templateUrl: "/templates/user/profile/edit.html",
                    controller: "profileEditController"
                }
            },
            data: {
                authorizedRoles: [ USER_ROLES.user, USER_ROLES.admin ]
            }
        })
        .state('profile.password', {
            url: "/password",
            views: {
                "profile": {
                    templateUrl: "/templates/user/profile/pwd.html",
                    controller: "profilePwdController"
                }
            },
            data: {
                authorizedRoles: [ USER_ROLES.user, USER_ROLES.admin ]
            }
        });

    $urlRouterProvider.otherwise(function ($injector, $location) {
        $injector.invoke(['$state', function ($state) { $state.go('artist'); }]);
        return true;
    });
});
app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});
app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    user: 'user',
    guest: 'guest'
});
app.run(function ($rootScope, AUTH_EVENTS, USER_ROLES, AuthService, $cookies) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if(!authorizedRoles) return; //return if we have no roles in list

        //return if we have USER_ROLES.all access
        for(var i = 0; i < authorizedRoles.length; i++) {
            if ( authorizedRoles[i] === USER_ROLES.all) return;
        }

        //get user data from server using session id
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }

    });
});
/*
app.factory('httpRequestInterceptor', function ($q, $location) {
    return {
        'responseError': function(rejection) {
            // do something on error
            if(rejection.status === 404){
                $location.path('/404/');
                return $q.reject(rejection);
            }
        }
    };
});*/
