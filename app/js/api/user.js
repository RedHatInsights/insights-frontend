/*global require*/
'use strict';

const apiModule = require('./');
const demoData = require('../demoData');

/**
 * @ngInject
 */
function User($rootScope, $http, $q, $location) {
    const _user = demoData.user;

    function isBeta() {
        // Temporary work around to only allow OSP in beta.
        // Remove the following code when OSP is ready for production.
        return $location.absUrl().indexOf('insightsbeta') > -1;
    }

    return {
        init: function () {
            return {
                then: () => {}
            };
        },

        current: demoData.user,
        asyncCurrent: function (cb) {
            return cb(_user);
        },

        isOnOSPWhitelist: function () {
            var onOSPWhitelist  = false;

            if (!isBeta()) {
                return false;
            }

            if (_user && _user.current_entitlements) {
                onOSPWhitelist = _user.current_entitlements.whitelist.osp;
            }

            return onOSPWhitelist;
        }
    };
}

apiModule.factory('User', User);
