var app = angular.module('app', ['ui.router', 'ui.bootstrap']);
app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!'); //Hashbang goes for compatibility with browsers that do not support html5 urls.
    $urlRouterProvider.otherwise("");
    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: "templates/home.html",
            controller: "mainController",
            data : { pageTitle: 'Интернет-магазин картин. Печать фото на холсте' }
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
            data : { pageTitle: 'Галлерея' }
        })
        .state('product', {
            url: "/gallery/:productId",
            templateUrl: "/templates/product.html",
            controller: "productController"
        });
});