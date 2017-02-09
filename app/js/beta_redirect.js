'use strict';

/**
 * @ngInject
 */
function BetaRedirect($window, $location) {
    var newLocation;
    var isBeta = JSON.parse(window.localStorage.getItem('isBeta'));
    if (isBeta !== window.insightsGlobal.isBeta) {
        if (isBeta) {
            newLocation = $location.absUrl().replace('/insightsbeta/', '/insights/');
        } else {
            newLocation = $location.absUrl().replace('/insights/', '/insightsbeta/');
        }

        $window.location.href = newLocation;
    }
}

module.exports = BetaRedirect;
