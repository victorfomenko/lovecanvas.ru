app.controller("productController", function($scope, $state){
    console.log($state);
    $scope.productName = $state.params.productId;
});