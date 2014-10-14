app.controller("orderController", function($scope, $http, $timeout, $state){
    var productModefierPrefix = 'product--';
    //Default states
    $scope.formName =           '';
    $scope.formPhone =           '';
    $scope.formEmail =           '';
    $scope.formProduct =        'PO';
    $scope.formFrameSize =      '40|60';
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
        $timeout(function(){
            $scope.productImageHeight = getImageData().height;
        },0);
        changeProportionsNoteText();
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
        var img = document.getElementById('mainPicture').src;
        //get all data from form fields
        var data = {
            img: img,
            name: $scope.formName,
            phone: $scope.formPhone,
            email: $scope.formEmail,
            productType: $scope.formProduct,
            frameSize: $scope.formFrameSize,
            frameType: $scope.formFrameType,
            borderType: $scope.formBorderType,
            price: $scope.formPrice
        };
        console.log(data);
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
    function changeClasses (){
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
    function updateImageProportions (){
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