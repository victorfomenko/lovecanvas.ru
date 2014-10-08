app.controller("orderController", function($scope, $http, $timeout, $state){
    var productModefierPrefix = 'product--';
    //Default states
    $scope.formName =           '';
    $scope.formPhone =           '';
    $scope.formEmail =           '';
    $scope.formProduct =        'PO';
    $scope.formFrameSize =      '17|32';
    $scope.formFrameType =      'none';
    $scope.formBorderType =     'none';
    $scope.formPrice =          '3200';
    $scope.productClass = productModefierPrefix + "print-only";
    $scope.productStates = [
        { id: 'PO', name: 'Печать', class: "print-only", isActive: true },
        { id: 'CP', name: 'На холсте', class: "canvas", isActive: false },
        { id: 'FP', name: 'В раме', class: "frame", isActive: false }
    ];
    var baseMainClass = $scope.productStates[0].class;
    $scope.mainClass = baseMainClass;
    var formListOptions = {
        print: {
            frame: [
                {value: "none", name: ""}
            ],
            borders: [
                {value: "none", name: ""}
            ]
        },
        canvas: {
            frame: [
                {value: '150', name: '1.5 см в толщину'},
                {value: '300', name: '3 см в толщину'}/*,
                {value: 'BF', name: 'Древесная черная'},
                {value: 'WF', name: 'Древесная белая'},
                {value: 'EF', name: 'Древесная кофейная'}*/
            ],
            borders: [
                {value: 'BB', name: 'Черный край'},
                {value: 'WB', name: 'Белый край'}
            ]
        },
        inframe: {
            frame: [
                {value: 'BF', name: 'Древесная черная'},
                {value: 'WF', name: 'Древесная белая'},
                {value: 'EF', name: 'Древесная кофейная'}
            ],
            borders: [
                {value: '630MA', name: '6 см матовые'},
                {value: 'NOMA', name: 'Без матовых краев'}
            ]
        }
    };
    $scope.frameOptions = formListOptions.print.frame;
    $scope.borderOptions = formListOptions.print.borders;

    $scope.changeProduct = function(product){
        $scope.productStates.forEach(function(item){
            item.isActive = false
        });
        product.isActive = true;
        $scope.disableEdge = false;

        if(product.id === "PO"){
            $scope.formFrameType = "none";
            $scope.formBorderType = "none";
            $scope.borderOptions = formListOptions.print.borders;
            $scope.frameOptions = formListOptions.print.frame;
        }
        else if(product.id === "CP"){
            $scope.formFrameType = "150";
            $scope.formBorderType = "BB";
            $scope.borderOptions = formListOptions.canvas.borders;
            $scope.frameOptions = formListOptions.canvas.frame;
        }
        else if(product.id === "FP") {
            $scope.formFrameType = "BF";
            $scope.formBorderType = "630MA";
            $scope.borderOptions = formListOptions.inframe.borders;
            $scope.frameOptions = formListOptions.inframe.frame;
        }
        baseMainClass = product.class;
        changeClasses();
    };
    $scope.updateMainClass = function(){
        $scope.disableEdge = false;
        //disable edge form if border frame selected
        if( baseMainClass === 'canvas' && ($scope.formFrameType === "BF" || $scope.formFrameType === "WF" || $scope.formFrameType === "EF") ) {
            $scope.disableEdge = true;
        }
        changeClasses();
    };
    $scope.hideOrderModal = function () {
        $scope.orderModalIsShow = false;
    };
    $scope.sendData = function(){
        //get all data from form fields
        var data = {
            name: $scope.formName,
            phone: $scope.formPhone,
            email: $scope.formEmail,
            productType: $scope.formProduct,
            frameSize: $scope.formFrameSize,
            frameType: $scope.formFrameType,
            borderType: $scope.formBorderType,
            price: $scope.formPrice
        };
        $scope.orderModalIsShow = true;
        var hideModal = function () {
            $scope.orderModalIsShow = false;
            $timeout.cancel();
            $state.go('main');
        };
        $scope.orderLoading = true;
        var request = $http.post('ajax/order.php/', data).success(function(data){
            if(data === "ok") {
                    console.log('ok');
                $scope.orderLoading = false;
                $scope.orderSuccess = true;
                $timeout(hideModal, 2000);

            }
        }).error(function(){
            console.log('error');
        });
        request;
    };
    var changeClasses = function(){
        $scope.mainClass = baseMainClass;
        $scope.productClass = productModefierPrefix + baseMainClass + ' ' + productModefierPrefix + $scope.formFrameType + ' ' + productModefierPrefix + $scope.formBorderType;
    };
});