app.controller("canvasController", function($scope, $http, $timeout, $state, appService){
    var productModefierPrefix = 'product--';
    var dataForSent = appService.dataForSent;
    //Default states
    $scope.formProduct =        dataForSent.formProduct;
    $scope.formFrameSize =      appService.optionsList.sizesH[5].value;
    $scope.formFrameType =      dataForSent.formFrameType;
    $scope.formBorderType =     dataForSent.formBorderType;
    $scope.formPrice =          appService.priceCalc();
    $scope.productClass =       productModefierPrefix + "frame " + productModefierPrefix + "630MA";
    $scope.productStates = [
        { id: 'PO', name: 'Печать', class: "print-only", isActive: true },
        { id: 'CP', name: 'На холсте', class: "canvas", isActive: false },
        { id: 'FP', name: 'В раме', class: "frame", isActive: false }
    ];
    var baseMainClass = $scope.productStates[2].class;
    var formListOptions = appService.optionsList;
    $scope.mainClass = baseMainClass;
    $scope.frameOptions = formListOptions.inframe.frame;
    $scope.borderOptions = formListOptions.inframe.borders;
    $scope.sizeOptions = formListOptions.sizesH;
    if(appService.imageProp < 1 ) {
        $scope.formFrameSize =      appService.optionsList.sizesV[5].value;
        $scope.sizeOptions = formListOptions.sizesV;
    }
    $scope.updateImageProportions = updateImageProportions;
    $scope.changeSize = function(frameSize){
        dataForSent.formFrameSize = frameSize;
        updateImageProportions();
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
        $timeout(function(){
            $scope.productImageHeight = getImageData().height;
        },0);
        changeProportionsNoteText();
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
    function proportions() {
        var frameProportions = getImageData().proportions,
            imageHeight = document.getElementById('mainPicture').naturalHeight,
            imageWidth = document.getElementById('mainPicture').naturalWidth,
            imageProportions = imageHeight/imageWidth,
            result = 1;
        if(frameProportions<imageProportions) result = -1;
        if ( Math.round(frameProportions*100)/100 === Math.round(imageProportions*100)/100) result = 0;
        return result
    }
    function getImageData () {
        var params = $scope.formFrameSize.split('|'),
            selectedHeight = params[0],
            selectedWidth = params[1],
            proportions = selectedHeight / selectedWidth,
            mainImageWidth = document.getElementById('image-container').offsetWidth,
            mainImageHeight = mainImageWidth * proportions;
        return {
            'height': mainImageHeight+ 'px',
            'width': mainImageWidth+ 'px',
            'proportions': proportions
        }
    }
    function updateImageProportions(){
        //show/hide proportions note
        $timeout(function(){
            $scope.productImageHeight = getImageData().height;
        },0);
        changeProportionsNoteText();
    }
    function changeProportionsNoteText () {
        $scope.showProportionsNoteText = '';
        $scope.showProportionsNote = false;
        if (proportions() === -1 || proportions() === 1) {
            $scope.showProportionsNote = true;
            $scope.showProportionsNoteText = '(фото обрежется по краям)'
        }
        if (proportions() === 0) {
            $scope.showProportionsNote = true;
            $scope.showProportionsNoteText = '(идеальный)'
        }
    }
    updateImageProportions();
    $("body").animate({scrollTop: 0}, 1);
});