app.controller("orderController", function($scope){
    var productModefierPrefix = 'product--';
    //Default states
    $scope.productSelected = 'PO';
    $scope.frameType = "none";
    $scope.frameSize = "17|32";
    $scope.borderType = "none";
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
            $scope.frameType = "none";
            $scope.borderType = "none";
            $scope.borderOptions = formListOptions.print.borders;
            $scope.frameOptions = formListOptions.print.frame;
        }
        else if(product.id === "CP"){
            $scope.frameType = "150";
            $scope.borderType = "BB";
            $scope.borderOptions = formListOptions.canvas.borders;
            $scope.frameOptions = formListOptions.canvas.frame;
        }
        else if(product.id === "FP") {
            $scope.frameType = "BF";
            $scope.borderType = "NOMA";
            $scope.borderOptions = formListOptions.inframe.borders;
            $scope.frameOptions = formListOptions.inframe.frame;
        }
        baseMainClass = product.class;
        changeClasses();
    };
    $scope.updateMainClass = function(){
        $scope.disableEdge = false;
        //disable edge form if border frame selected
        if( baseMainClass === 'canvas' && ($scope.frameType === "BF" || $scope.frameType === "WF" || $scope.frameType === "EF") ) {
            $scope.disableEdge = true;
        }
        changeClasses();
    };
    var changeClasses = function(){
        $scope.mainClass = baseMainClass;
        $scope.productClass = productModefierPrefix + baseMainClass + ' ' + productModefierPrefix + $scope.frameType + ' ' + productModefierPrefix + $scope.borderType;
        console.log($scope.productClass);
    }
});