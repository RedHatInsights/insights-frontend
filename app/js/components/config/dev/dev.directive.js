/*global window, require*/
'use strict';

var componentsModule = require('../../');
/**
 * @ngInject
 */
function ConfigDevCtrl($scope, User, InsightsConfig) {
    $scope.user = User.current;
    $scope.tmp = {
        apiPrefix: InsightsConfig.apiPrefix,
        apiVersion: InsightsConfig.apiVersion,
        entitlements: {}
    };

    $scope.presets = {
        apiPrefix: {
            default: InsightsConfig.defaultApiPrefix,
            local: 'local/'
        },
        apiVersions: [
            'v1',
            'v2'
        ],
        entitlements: {
            paid: {
                unlimitedRHEL: false,
                whitelist: {
                    rhel: false,
                    osp: false
                },
                totalRHEL: 32,
                skus: [
                    {
                        skuName: 'MCT3292',
                        quantity: 2,
                        system_count: 1,
                        unlimited: false
                    }
                ],
                activeSystemCount: 1,
                systemLimitReached: false
            },
            paidWithFewSystems: {
                unlimitedRHEL: false,
                whitelist: {
                    rhel: false,
                    osp: false
                },
                totalRHEL: 9,
                skus: [
                    {
                        skuName: 'MCT3292',
                        quantity: 2,
                        system_count: 1,
                        unlimited: false
                    }
                ],
                activeSystemCount: 1,
                systemLimitReached: false
            },
            unpaid: {
                activeSystemCount: 1,
                skus: [
                    {
                        skuName: 'SER0482',
                        quantity: 2,
                        system_count: 0,
                        unlimited: false
                    }
                ],
                systemLimitReached: false,
                totalRHEL: 8,
                unlimitedRHEL: false,
                whitelist: {
                    osp: false,
                    rhel: false
                }
            },
            unpaidSystemLimitReached: {
                activeSystemCount: 10,
                skus: [
                    {
                        skuName: 'SER0482',
                        quantity: 2,
                        system_count: 0,
                        unlimited: false
                    }
                ],
                systemLimitReached: true,
                totalRHEL: 10,
                unlimitedRHEL: false,
                whitelist: {
                    osp: false,
                    rhel: false
                }
            },
            whitelisted: {
                whitelist: {
                    rhel: true,
                    osp: true
                }
            }
        }
    };

    $scope.getPretty = function (obj) {
        return JSON.stringify(obj, null, 2);
    };

    $scope.setEntitlements = function () {
        $scope.user.current_entitlements = $scope.presets.entitlements[$scope.tmp.tmpEnt];
        window.localStorage.setItem(
            'insights:fake:entitlements',
            JSON.stringify($scope.user.current_entitlements));
    };

    $scope.setEntitlementsByKey = function (key) {
        var obj;
        try {
            obj = JSON.parse($scope.tmp.entitlements[key]);
            $scope.user.current_entitlements[key] = obj;
        } catch (ignore) {}
    };

    $scope.save = function () {
        window.localStorage.setItem('insights:apiVersion', $scope.tmp.apiVersion);
        window.localStorage.setItem('insights:apiPrefix', $scope.tmp.apiPrefix);
        window.location.reload();
    };

    $scope.injectNewKey = function () {
        $scope.user.current_entitlements[$scope.newKey] = {};
    };

    function demoModeIsEnabled() {
        if (window.localStorage.getItem('tapi:demo') === 'true') {
            return true;
        } else {
            return false;
        }
    }

    $scope.getDemoModeButtonText = function () {
        if (demoModeIsEnabled()) {
            return 'Disable Demo Mode';
        } else {
            return 'Enable Demo Mode';
        }
    };

    $scope.demoModeButtonOnClick = function () {
        if (demoModeIsEnabled()) {
            window.localStorage.setItem('tapi:demo', false);
        } else {
            window.localStorage.setItem('tapi:demo', true);
        }

        window.location.reload();

        //$route.reload();
    };
}

function configDev() {
    return {
        templateUrl: 'js/components/config/dev/dev.html',
        restrict: 'E',
        scope: false,
        controller: ConfigDevCtrl
    };
}

componentsModule.directive('configDev', configDev);
