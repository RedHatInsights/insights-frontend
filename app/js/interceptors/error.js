'use strict';

function isError(code) {
    return (code >= 500 && code < 600);
}

/**
 * @ngInject
 */
function ErrorInterceptor($q, AlertService) {
    return {
        responseError: function (response) {
            // These seems a bit of overkill... However,
            // the docs on responseError are a bit sketchy.
            // It says this gets called whenever a deferred is rejected, but doesn't
            // explicitly say on a 5xx error. So I am double checking it here.
            if (isError(response.status)) {
                AlertService.setHttpError(response);
            }

            return $q.reject(response);
        }
    };
}

module.exports = ErrorInterceptor;
