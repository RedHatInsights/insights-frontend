/*global require*/
'use strict';

const servicesModule = require('./');

/**
 * @ngInject
 */
function BounceService(InsightsConfig) {
    return {
        bounce: function () {
            if (InsightsConfig.authenticate) {
                window.insightsGlobal.jwtLoginCustom();
            }
        }
    };
}

servicesModule.service('BounceService', BounceService);
