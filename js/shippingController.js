app.controller("shippingController", function($scope, $http, $timeout, $state, appService){
    document.getElementById('name').focus();
    var dataForSend =           appService.dataForSent;
    $scope.formCity =           dataForSend.formCity;
    $scope.price =              dataForSend.formPrice;
    $scope.cityOptions = [
        {value: 'Москва', name: 'Москва'},
        {value: 'Санкт-Петербург', name: 'Санкт-Петербург'},
        {value: 'Екатеринбург', name: 'Екатеринбург'},
        {value: 'Иркутск', name: 'Иркутск'},
        {value: 'Ижевск', name: 'Ижевск'},
        {value: 'Казань', name: 'Казань'},
        {value: 'Киев', name: 'Киев'},
        {value: 'Краснодар', name: 'Краснодар'},
        {value: 'Минск', name: 'Минск'},
        {value: 'Нижний Новгород', name: 'Нижний Новгород'},
        {value: 'Новосибирск', name: 'Новосибирск'},
        {value: 'Пермь', name: 'Пермь'},
        {value: 'Ростов-на-Дону', name: 'Ростов-на-Дону'},
        {value: 'Самара', name: 'Самара'},
        {value: 'Тверь', name: 'Тверь'},
        {value: 'Чебоксары', name: 'Чебоксары'},
        {value: 'Челябинск', name: 'Челябинск'}
    ];
    $scope.hideOrderModal = function () {
        $scope.orderModalIsShow = false;
    };
    $scope.sendData = function(){
        dataForSend.formEmail =     $scope.formEmail;
        dataForSend.formPostal =    $scope.formPostal;
        dataForSend.formName =      $scope.formName;
        dataForSend.formPhone =     $scope.formPhone;
        dataForSend.formCity =      $scope.formCity;
        $scope.orderModalIsShow = true;
        var hideModal = function () {
            $scope.orderModalIsShow = false;
            $timeout.cancel();
            $state.go('main');
        };
        $scope.orderLoading = true;
        var request = $http.post('ajax/order.php', dataForSend).success(function(data){
            if(data === "ok") {
                $scope.orderLoading = false;
                $scope.orderSuccess = true;
                $timeout(hideModal, 3000);

            }
        }).error(function(){
            console.log('error');
        });
        request;
    };
});