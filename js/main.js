var app = angular.module('app', ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!'); //Hashbang goes for compatibility with browsers that do not support html5 urls.
    $urlRouterProvider.otherwise("");
    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: "templates/home.html",
            controller: "mainController",
            data : { pageTitle: 'Главная' }
        })
        .state('wedding', {
            url: "/wedding",
            templateUrl: "templates/wedding.html",
            controller: "mainController",
            data : { pageTitle: 'Печать свадебных фото' }
        })
        .state('canvas', {
            url: "/canvas",
            templateUrl: "templates/canvas.html",
            controller: "canvasController",
            data : { pageTitle: 'Картина' }
        })
        .state('shipping', {
            url: "/shipping",
            templateUrl: "templates/shipping.html",
            controller: "shippingController",
            data : { pageTitle: 'Заказ' }
        });
});