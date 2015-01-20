app.controller("shippingController", function($scope, $http, $timeout, $state, appService){
    document.getElementById('name').focus();
    var dataForSend =           appService.dataForSent;
    $scope.formCity =           dataForSend.formCity;
    $scope.price =              dataForSend.formPrice;
    calculatePrice(dataForSend.formCity);
    $scope.cityOptions = [
        {value: 'Москва', name: 'Москва'},
        {value: 'Санкт-Петербург', name: 'Санкт-Петербург'},
        {value: 'Альметьевск', name: 'Альметьевск'},
        {value: 'Екатеринбург', name: 'Екатеринбург'},
        {value: 'Иркутск', name: 'Иркутск'},
        {value: 'Ижевск', name: 'Ижевск'},
        {value: 'Казань', name: 'Казань'},
        {value: 'Киев', name: 'Киев'},
        {value: 'Краснодар', name: 'Краснодар'},
        {value: 'Минск', name: 'Минск'},
        {value: 'Нижний Новгород', name: 'Нижний Новгород'},
        {value: 'Набережные Челны', name: 'Набережные Челны'},
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
    $scope.changeCity = function(city){
        calculatePrice(city);
        console.log(dataForSend.formShippingPrice)
    };
    function calculatePrice (city){
        $scope.shippingPrice =      dataForSend.formShippingPrice = 0;
        $scope.summaryPrice =       dataForSend.formPrice + dataForSend.formShippingPrice;
        if(city !== 'Казань') {
            $scope.shippingPrice =      dataForSend.formShippingPrice = 350;
            $scope.summaryPrice =       dataForSend.formPrice + dataForSend.formShippingPrice;
        }
    }
    $scope.sendData = function(){
        dataForSend.formEmail =     $scope.formEmail;
        dataForSend.formPostal =    $scope.formPostal;
        dataForSend.formName =      $scope.formName;
        dataForSend.formPhone =     $scope.formPhone;
        dataForSend.formAddress =   $scope.formAddress;
        dataForSend.formCity =      $scope.formCity;
        $scope.orderModalIsShow = true;
        var hideModal = function () {
            $scope.orderModalIsShow = false;
            $timeout.cancel();
            $state.go('main');
        };
        $scope.orderLoading = true;
        var request = $http.post('ajax/order.php', dataForSend).success(function(data){
            console.log(data);
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
    $("body").animate({scrollTop: 0}, 1);
});