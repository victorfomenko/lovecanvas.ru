var app = angular.module('app', ['ui.router', 'seo']);
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
        .state('order', {
            url: "/order",
            templateUrl: "templates/order.html",
            controller: "orderController",
            data : { pageTitle: 'Заказ' }
        });
});