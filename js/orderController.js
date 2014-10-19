app.controller("orderController", function($scope, $http, $timeout, $state, appService){
    var productModefierPrefix = 'product--';
    var dataForSent = appService.dataForSent;
    //Default states
    $scope.formProduct =        dataForSent.formProduct;
    $scope.formFrameSize =      dataForSent.formFrameSize;
    $scope.formFrameType =      dataForSent.formFrameType;
    $scope.formBorderType =     dataForSent.formBorderType;
    $scope.formPrice =          appService.priceCalc();
    $scope.formCity =           dataForSent.formCity;

    $scope.productClass =       productModefierPrefix + "print-only";
    $scope.productStates = [
        { id: 'PO', name: 'Печать', class: "print-only", isActive: true },
        { id: 'CP', name: 'На холсте', class: "canvas", isActive: false },
        { id: 'FP', name: 'В раме', class: "frame", isActive: false }
    ];
    $scope.cityOptions = [
        {value: 'Санкт-Петербург', name: 'Санкт-Петербург'},
        {value: 'Казань', name: 'Казань'}
    ];
    var baseMainClass = $scope.productStates[0].class;
    $scope.mainClass = baseMainClass;
    var formListOptions = {
        print: {
            frame: [
                {value: null, name: ""}
            ],
            borders: [
                {value: null, name: ""}
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
        },
        sizes: [
              {value: '20|25', name: '20см × 25см'},
              {value: '30|30', name: '30см × 30см'},
              {value: '30|40', name: '30см × 40см'},
              {value: '30|45', name: '30см × 45см'},
              {value: '40|50', name: '40см × 50см'},
              {value: '40|60', name: '40см × 60см'},
              {value: '45|60', name: '45см × 60см'},
              {value: '50|60', name: '50см × 60см'},
              {value: '60|60', name: '60см × 60см'},
              {value: '50|75', name: '50см × 75см'},
              {value: '60|90', name: '60см × 90см'},
              {value: '90|90', name: '90см × 90см'},
              {value: '95|95', name: '95см × 95см'},
              {value: '75|100', name: '75см × 100см'},
              {value: '45|120', name: '45см × 120см'},
              {value: '90|135', name: '90см × 135см'},
              {value: '60|180', name: '60см × 180см'}
        ]

    };
    $scope.frameOptions = formListOptions.print.frame;
    $scope.borderOptions = formListOptions.print.borders;
    $scope.sizeOptions = formListOptions.sizes;
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
        console.log(dataForSent);
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
    $scope.hideOrderModal = function () {
        $scope.orderModalIsShow = false;
    };
    $scope.sendData = function(){
        //get all data from form fields
        dataForSent.formName = $scope.formName;
        dataForSent.formPhone = $scope.formPhone;
        dataForSent.formEmail = $scope.formEmail;
        $scope.orderModalIsShow = true;
        var hideModal = function () {
            $scope.orderModalIsShow = false;
            $timeout.cancel();
            $state.go('main');
        };
        $scope.orderLoading = true;
        var request = $http.post('ajax/order.php', dataForSent).success(function(data){
            if(data === "ok") {
                $scope.userName = data.formName;
                $scope.orderLoading = false;
                $scope.orderSuccess = true;
                $timeout(hideModal, 2000);

            }
        }).error(function(){
            console.log('error');
        });
        request;
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
            'proportions': proportions
        }
    }
    function updateImageProportions(){
        $scope.productImageHeight = getImageData().height;
        //show/hide proportions note
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
});