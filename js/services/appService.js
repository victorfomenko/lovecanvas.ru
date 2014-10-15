(function(){
    var moduleId = 'app';
    app.factory(moduleId + 'Service', function() {
        var api = {};
        api.dataForSent = {
            formName:           null,
            formPhone:          null,
            formEmail:          null,
            formProduct:        'PO',
            formFrameSize:      '40|60',
            formFrameType:      null,
            formBorderType:     null,
            formPrice:          null,
            formCity:           'Казань',
            image:              null
        };
        api.priceCalc = function (){
            var data = this.dataForSent;
            if( !data.formProduct || !data.formFrameSize ) return;
            var price = 0;
            var frameSizeWH = data.formFrameSize.split('|'),
                frameSizeSquare = frameSizeWH[0] * frameSizeWH[1];

            //calculate if print only
            if( data.formProduct === "PO" &&  !data.formFrameType && !data.formBorderType ) {
                var printOnlySquareItem = 2.7; //1 rub is 2.7 sm2
                price = Math.round((frameSizeSquare/printOnlySquareItem)/10)*10
            }
            else if( data.formProduct === "CP" &&  data.formFrameType && data.formBorderType ) {
                var canvasSquareItem = 3.7; //1 rub is 2.7 sm2
                price = Math.round((frameSizeSquare/canvasSquareItem)/10)*10;
                if ( data.formFrameType === "150") price += 880;
                if ( data.formFrameType === "300") price += 1880;
            }
            else if( data.formProduct === "FP" &&  data.formFrameType && data.formBorderType ) {
                var frameSquareItem = 2.7; //1 rub is 2.7 sm2
                price = Math.round((frameSizeSquare/frameSquareItem)/10)*10;
                if ( data.formBorderType === "630MA") price += 2000;
            }
            this.dataForSent.formPrice = price;
            return price;
        };
        return api;
    })
}).call(this);