'use strict';

var servicesModule = require('./');
var urijs = require('urijs');

/**
 * @ngInject
 */
function BetaRedirectService($window, $location) {
    function switchLocation (oldLoc, newLoc) {
        var newLocation = $location.absUrl().replace(oldLoc, newLoc);
        $window.location.href = urijs(newLocation)
                                .addSearch('utm_campaign', 'BetaSwitchButton')
                                .addSearch('utm_medium', 'webpage')
                                .addSearch('utm_source', newLoc.replace(/\//g, ''))
                                .toString();
    }

    return {
        goToBeta: function () {
            switchLocation('/insights/', '/insightsbeta/');
        },

        goToStable: function () {
            switchLocation('/insightsbeta/', '/insights/');
        },

        checkAndRedirect: function () {
            var betaOptIn = JSON.parse(window.localStorage.getItem('betaOptIn'));
            if (betaOptIn && !window.insightsGlobal.isBeta) {
                switchLocation('/insights/', '/insightsbeta/');
            }
        }
    };
}

servicesModule.service('BetaRedirectService', BetaRedirectService);
