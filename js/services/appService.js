(function(){
    var moduleId = 'app';
    app.factory(moduleId + 'Service', function() {
        var api = {};
        api.dataForSent = {
            formName:           null,
            formPhone:          null,
            formEmail:          null,
            formPostal:         null,
            formProduct:        'FP',
            formFrameSize:      '40|60',
            formFrameType:      'BF',
            formBorderType:     '630MA',
            formPrice:          null,
            formCity:           'Казань',
            image:              null
        };
        api.priceCalc = function (){
            var data = this.dataForSent;
            if( !data.formProduct || !data.formFrameSize ) return;
            var price = 0;
            var frameSizeWH = data.formFrameSize.split('|'),
                frameSizeSquare = (frameSizeWH[0] * frameSizeWH[1])/10000,
                frameSizeSquareInner = ((frameSizeWH[0]-3) * (frameSizeWH[1]-3))/10000,
                frameLength = (frameSizeWH[0]*2 + frameSizeWH[1]*2)/100,
                POCoast = 700,
                CPCoast = 1000,
                FPCoast = 1000,
                mounts = 50,
                underFrameCoast1 = 80,
                underFrameCoast2 = 160,
                frameCoast = 250,
                penokartonCoast = 450,
                paspartuCoast = 700;

            //calculate if print only
            if( data.formProduct === "PO" &&  !data.formFrameType && !data.formBorderType ) {
                price = 2*Math.round((frameSizeSquare*POCoast/10000)/10)*10 + 100
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
                price = frameSizeSquareInner*FPCoast + frameLength*frameCoast + frameSizeSquareInner*paspartuCoast + frameSizeSquareInner*penokartonCoast + mounts;
                price = 2*Math.round(price/10)*10 + 100;// add 100% and 100 rub for deals

            }
            this.dataForSent.formPrice = price;
            return price;
        };
        return api;
    })
}).call(this);