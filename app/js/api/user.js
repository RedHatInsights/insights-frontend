/*global require*/
'use strict';

const apiModule = require('./');

const demoUser = {
    loaded: true,
    account_number: '6',
    org_id: '1979710',
    email: 'burr@redhat.com',
    locale: 'en_US',
    is_active: true,
    is_org_admin: true,
    is_internal: true,
    sso_username: 'demo-burr',
    cachehit: false,
    mechanism: 'KeycloakJwtAuth',
    user_key: 'demo-burr',
    autoOptedIn: true,
    settings: {
        dashboard_mode: 'rhel',
        hide_ignored_rules: '0',
        maintenance_plan_category: 'unscheduled',
        osp_deployment: '18ff8199-a84f-463d-99e4-043bd8edd37e'
    },
    permissions: {},
    current_entitlements: {
        unlimitedRHEL: true,
        whitelist: {
            rhel: true,
            osp: true,
            rhev: true,
            docker: true,
            ocp: true
        },
        totalRHEL: 0,
        skus: [
            {
                skuName: 'SER0232',
                quantity: 3000,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0409',
                quantity: 70,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0422',
                quantity: 100,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0421',
                quantity: 100,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'ES01139',
                quantity: 1000,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'SER0412',
                quantity: 101,
                unlimited: true,
                system_count: 0
            },
            {
                skuName: 'RH00763',
                quantity: 2,
                unlimited: false,
                system_count: 1
            }
        ],
        activeSystemCount: 323,
        systemLimitReached: false
    },
    has_osp: true,
    is_super: false
};

/**
 * @ngInject
 */
function User($rootScope, $http, $q, $location) {
    const _user = demoUser;

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

        current: demoUser,
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
