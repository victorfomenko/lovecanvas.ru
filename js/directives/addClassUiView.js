app.directive('addClass', function($rootScope, $timeout) {
    return {
        link: function(scope, element) {

            var listener = function(event, toState) {
                var className = '';
                if (toState.data && toState.data.className) className = toState.data.className;
                // Set asynchronously so page changes before title does
                $timeout(function() {
                    element.addClass(className);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
});