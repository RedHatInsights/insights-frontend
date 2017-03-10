/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function severityIconCtrl($scope) {
    const priv = {};

    priv.iconClass = function iconClass (level) {
        switch (level) {
            case 1:
                return 'low';
            case 2:
                return 'med';
            case 3:
                return 'high';
            case 4:
                return 'critical';
            default:
                return 'unknown';
        }
    };

    // pre compute this so the digest cycles dont re-run iconClass
    // we really only use this once since the refactor
    // it is nice an delcaritive though, leaving it in
    priv.sevClassMap = {
        // for now handle the stringed severity... this will go away once sevs are 1 - 4
        INFO: priv.iconClass(1),
        WARN: priv.iconClass(2),
        ERROR: priv.iconClass(3),
        CRITICAL: priv.iconClass(4),
        1: priv.iconClass(1),
        2: priv.iconClass(2),
        3: priv.iconClass(3),
        4: priv.iconClass(4)
    };

    // init the var on the scope
    // it should not change and there is no point in re calculating it
    $scope.init = function init () {
        if (!$scope.severity) {
            // dirty hack until the API stuff is shipping
            // for matt
            $scope.severity = Math.floor(Math.random() * 4) + 1;
        }
        $scope.sevClass = priv.sevClassMap[$scope.severity];
    };
}

function severityIcon () {
    return {
        scope: {
            type: '@',
            label: '@',
            severity: '<' // opt bind just for hacked in optional include of sev
        },
        templateUrl: 'js/components/severityIcon/severityIcon.html',
        restrict: 'EC',
        replace: true,
        controller: severityIconCtrl
    };
}

componentsModule.directive('severityIcon', severityIcon);
