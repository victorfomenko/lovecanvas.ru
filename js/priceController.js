app.controller("priceController", function($scope, $http, $timeout, $state, appService){

    var dataForSent = appService.dataForSent;
    var formListOptions = appService.optionsList;
    var borderType = '';
    var arrCoastsAndSizes = [];

    //Default states
    $scope.formProduct =        dataForSent.formProduct;
    $scope.formBorderType =     dataForSent.formBorderType;
    $scope.formFrameType =      dataForSent.formFrameType;
    $scope.productStates =      appService.productStates;

    $scope.sizeOptions =        formListOptions.sizes;
    $scope.borderOptions =      formListOptions.canvas.borders;
    $scope.frameOptions =      formListOptions.canvas.frame;

    $scope.width = formListOptions.sizes[0].value;
    $scope.height = formListOptions.sizes[0].value;
    $scope.tableArr = [];


    $scope.calcPrice = function(){
        switch ($scope.formProduct){
            default:
            case 'CP':
                borderType = $scope.formFrameType;
                break;
            case 'FP':
                borderType = $scope.formBorderType;
                break;
        }
        $scope.price = appService.calcPrice($scope.width, $scope.height, $scope.formProduct, borderType);
    };

    $scope.changeProduct = function(product){
        var productType = product.id;
        $scope.productStates.forEach(function(item){
            item.isActive = false
        });
        product.isActive = true;
        $scope.disableEdge = false;

        if(productType === "PO"){
            $scope.formFrameType = dataForSent.formFrameType = null;
            $scope.formBorderType = dataForSent.formBorderType = null;
            $scope.borderOptions = formListOptions.print.borders;
            $scope.frameOptions = formListOptions.print.frame;
        }
        else if(productType === "CP"){
            $scope.formFrameType = dataForSent.formFrameType =  "150";
            $scope.formBorderType = dataForSent.formBorderType =  "BB";
            $scope.borderOptions = formListOptions.canvas.borders;
            $scope.frameOptions = formListOptions.canvas.frame;
        }
        else if(productType === "FP") {
            $scope.formFrameType = dataForSent.formFrameType = "BF";
            $scope.formBorderType = dataForSent.formBorderType = "630MA";
            $scope.borderOptions = formListOptions.inframe.borders;
            $scope.frameOptions = formListOptions.inframe.frame;
        }
        $scope.formProduct = productType;
        $scope.calcPrice();
    };

    $scope.tableArr = getCoastArrForTable();
    function getCoastArrForTable () {
        var sizes = formListOptions.sizesH;
        var productStates = appService.productStates;
        sizes.forEach(function(item){
            var size = item.value.split('|'),
                width = size[0]*1,
                height = size[1]*1,
                POCoast = appService.calcPrice(width, height, productStates[0].id),
                canvas150Coast = appService.calcPrice(width, height, productStates[1].id, appService.optionsList.canvas.frame[0].value),
                canvas300Coast = appService.calcPrice(width, height, productStates[1].id, appService.optionsList.canvas.frame[1].value),
                frame630MACoast = appService.calcPrice(width, height, productStates[2].id, appService.optionsList.inframe.borders[0].value),
                frameNOMACoast = appService.calcPrice(width, height, productStates[2].id, appService.optionsList.inframe.borders[1].value);


           var arrItem = {
                sizeName: width + ' x ' + height,
                printCoast: POCoast,
                canvas150Coast: canvas150Coast,
                canvas300Coast: canvas300Coast,
                frameNOMACoast: frameNOMACoast,
                frame630MACoast: frame630MACoast
            };
            arrCoastsAndSizes.push(arrItem);
        });
        return arrCoastsAndSizes
    }
    $scope.calcPrice();

});