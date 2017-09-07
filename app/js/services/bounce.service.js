/*global require*/
'use strict';

const servicesModule = require('./');
const URI = require('urijs');
const Jwt = require('jwt-redhat').default;
/**
 * @ngInject
 */
function BounceService(InsightsConfig) {
    return {
        bounce: function () {
            if (InsightsConfig.authenticate) {
                Jwt.login();
            }
        }
    };
}

servicesModule.service('BounceService', BounceService);
