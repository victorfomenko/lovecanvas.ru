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
            var printOnlySquareItem = 2.7; //1 rub is 2.7 sm2
            var frameSizeWH = data.formFrameSize.split('|'),
                frameSizeSquare = frameSizeWH[0] * frameSizeWH[1];

            //calculate if print only
            if( data.formProduct === "PO" &&  !data.formFrameType && !data.formBorderType ) {
                price = Math.round((frameSizeSquare/printOnlySquareItem)/10)*10
            }
            this.dataForSent.formPrice = price;
            return price;
        };
        return api;
    })
}).call(this);