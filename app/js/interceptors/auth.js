'use strict';

/**
 * @ngInject
 */
function AuthInterceptor($q, $injector, BounceService) {
    return {
        responseError: function (response) {
            if (response.status === 401) {
                BounceService.bounce();
            } else if (response.status === 402) {
                let $state = $injector.get('$state');
                if ($state) {
                    $state.go('app.paymentrequired');
                }
            }

            return $q.reject(response);
        }
    };
}

module.exports = AuthInterceptor;
