app.controller('ordersController', function ($scope, $http) {
    $http.post('/ajax/getOrdersInfo.php')
        .success(function(data){
            $scope.orders = data
        })
        .error(function(){
            console.log("Something went wrong. AJAX ERROR.");
        })
});
