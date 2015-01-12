app.controller("productController", function($scope, $state, $http, appService){
    var productModefierPrefix = 'product--';
    var dataForSent = appService.dataForSent;
    //Default states
    $scope.formProduct =        dataForSent.formProduct;
    $scope.formFrameType =      dataForSent.formFrameType;
    $scope.formBorderType =     dataForSent.formBorderType;
    $scope.productClass =       productModefierPrefix + "frame " + productModefierPrefix + "630MA";
    $scope.productStates = [
        { id: 'PO', name: 'Печать', class: "print-only", isActive: true },
        { id: 'CP', name: 'На холсте', class: "canvas", isActive: false },
        { id: 'FP', name: 'В раме', class: "frame", isActive: false }
    ];
    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];
    var baseMainClass = $scope.productStates[2].class;
    var formListOptions = appService.optionsList;
    $scope.mainClass = baseMainClass;
    $scope.frameOptions = formListOptions.inframe.frame;
    $scope.borderOptions = formListOptions.inframe.borders;
    $scope.samplesIsShow = false;

    $scope.changeSize = function(frameSize){
        dataForSent.formFrameSize = frameSize;
        $scope.formPrice = appService.priceCalc();
    };
    $scope.changeFrame = function(frameType){
        dataForSent.formFrameType = frameType;
        updateMainClass();
        $scope.formPrice = appService.priceCalc();
    };
    $scope.changeBorder = function(borderType){
        dataForSent.formBorderType = borderType;
        updateMainClass();
        $scope.formPrice = appService.priceCalc();
    };
    $scope.changeProduct = function(product){
        $scope.productStates.forEach(function(item){
            item.isActive = false
        });
        product.isActive = true;
        $scope.disableEdge = false;
        //disable edge form if border frame selected
        if( baseMainClass === 'canvas' && (dataForSent.formFrameType === "BF" || dataForSent.formFrameType === "WF" || dataForSent.formFrameType === "EF") ) {
            $scope.disableEdge = true;
        }
        if(product.id === "PO"){
            $scope.formFrameType = dataForSent.formFrameType = null;
            $scope.formBorderType = dataForSent.formBorderType = null;
            $scope.borderOptions = formListOptions.print.borders;
            $scope.frameOptions = formListOptions.print.frame;
        }
        else if(product.id === "CP"){
            $scope.formFrameType = dataForSent.formFrameType =  "150";
            $scope.formBorderType = dataForSent.formBorderType =  "BB";
            $scope.borderOptions = formListOptions.canvas.borders;
            $scope.frameOptions = formListOptions.canvas.frame;
        }
        else if(product.id === "FP") {
            $scope.formFrameType = dataForSent.formFrameType = "BF";
            $scope.formBorderType = dataForSent.formBorderType = "630MA";
            $scope.borderOptions = formListOptions.inframe.borders;
            $scope.frameOptions = formListOptions.inframe.frame;
        }
        baseMainClass = product.class;
        updateMainClass();
        dataForSent.formProduct = product.id;
        $scope.formPrice = appService.priceCalc();
        //console.log(dataForSent);
    };
    $scope.goToShipping = function(){
        $state.go('shipping');
    };
    function updateMainClass () {
        $scope.mainClass = baseMainClass;
        $scope.productClass = [ productModefierPrefix + baseMainClass,
            productModefierPrefix + $scope.formFrameType,
            productModefierPrefix + $scope.formBorderType];
    }

    var picData;
    $http.post('/ajax/getPic.php', $state.params.productId)
        .success(function(data){
            if (typeof  data === 'object') {
                picData = data;
            }
        })
        .error(function(){
            console.log("Something went wrong. AJAX ERROR.");
        }).then(function(){
            $scope.pic = picData;
            if(picData.sizes.length > 0) {
                dataForSent.formFrameSize = picData.sizes[0].value;
                dataForSent.imageBase64 = null;
                dataForSent.image = picData.full;
                $scope.formFrameSize =      dataForSent.formFrameSize;
                $scope.sizeOptions =        picData.sizes;
            }
            $scope.formPrice =          appService.priceCalc();
        });
});