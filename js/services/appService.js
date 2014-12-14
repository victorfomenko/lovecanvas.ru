(function(){
    var moduleId = 'app';
    app.factory(moduleId + 'Service', function($http) {
        var api = {};
        api.optionsList = {
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
            sizesH: [
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
            ],
            sizesV: [
                {value: '25|20', name: '25см × 20см'},
                {value: '30|30', name: '30см × 30см'},
                {value: '40|30', name: '40см × 30см'},
                {value: '45|30', name: '45см × 30см'},
                {value: '50|40', name: '50см × 40см'},
                {value: '60|40', name: '60см × 40см'},
                {value: '60|45', name: '60см × 45см'},
                {value: '60|50', name: '60см × 50см'},
                {value: '60|60', name: '60см × 60см'},
                {value: '75|50', name: '75см × 50см'},
                {value: '90|60', name: '90см × 60см'},
                {value: '90|90', name: '90см × 90см'},
                {value: '95|95', name: '95см × 95см'},
                {value: '100|75', name: '100см × 75см'}
            ]
        };
        api.pictures = [];
        api.dataForSent = {
            formName:           null,
            formPhone:          null,
            formEmail:          null,
            formPostal:         null,
            formProduct:        'FP',
            formFrameSize:      api.optionsList.sizesH[5].value,
            formFrameType:      'BF',
            formBorderType:     '630MA',
            formPrice:          null,
            formShippingPrice:  0,
            formCity:           'Казань',
            imageBase64:        null,
            image:              null

        };
        api.imageProp = 1.5; //default horizontal prop
        api.priceCalc = function (){
            var data = this.dataForSent;
            if( !data.formProduct || !data.formFrameSize ) return;
            var price = 0;
            var frameSizeWH = data.formFrameSize.split('|'),
                frameSizeSquare = (frameSizeWH[0] * frameSizeWH[1])/10000,
                frameSizeSquareInner = ((frameSizeWH[0]-3) * (frameSizeWH[1]-3))/10000,
                frameLength = (frameSizeWH[0]*2 + frameSizeWH[1]*2)/100,
                POCoast = 1000,
                CPCoast = 1000,
                FPCoast = 1000,
                mounts = 60,
                underFrameCoast1 = 70,
                underFrameCoast2 = 160,
                frameCoast = 250,
                penokartonCoast = 310,
                paspartuCoast = 600,
                glassCoast =    1000;
            //calculate if print only
            if( data.formProduct === "PO" &&  !data.formFrameType && !data.formBorderType ) {
                price = 2*Math.round((frameSizeSquare*POCoast)/10)*10 + 100;
            }
            //calculate if canvas print
            else if( data.formProduct === "CP" &&  data.formFrameType && data.formBorderType ) {

                var underFrameCoast;
                switch (data.formFrameType){
                    default:
                    case '150':
                        underFrameCoast = underFrameCoast1;
                        break;
                    case '300':
                        underFrameCoast = underFrameCoast2;
                        break;
                }

                price = frameSizeSquare*CPCoast + (frameSizeWH[0]*1+frameSizeWH[1]*1)*underFrameCoast/50 + mounts;
                price = 2*Math.round(price/10)*10 + 100; // add 100% and 100 rub for deals

            }
            //calculate if frame print
            else if( data.formProduct === "FP" &&  data.formFrameType && data.formBorderType ) {
                if (data.formBorderType === 'NOMA'){
                    paspartuCoast = 0
                }
                price = frameSizeSquareInner*FPCoast + frameSizeSquareInner*glassCoast + frameLength*frameCoast + frameSizeSquareInner*paspartuCoast + frameSizeSquareInner*penokartonCoast + mounts;
                price = 2*Math.round(price/10)*10 + 100;// add 100% and 100 rub for deals

            }
            this.dataForSent.formPrice = price;
            return price;
        };
        api.getImageList = function (limit) {
            var result;
            return $http.post('/ajax/getListOfPic.php', limit)
                .success(function(data){
                    if (typeof  data === 'object') {
                        result = data;
                    }
                })
                .error(function(){
                    result = "Something went wrong. AJAX ERROR.";
                }).then(function(){
                    api.pictures = result;
                });
        };
        return api;
    })
}).call(this);