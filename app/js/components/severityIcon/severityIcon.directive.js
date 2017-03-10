/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function severityIconCtrl($scope, gettextCatalog) {
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

    priv.typeMap = {
        impact: gettextCatalog.getString('Impact'),
        likelihood: gettextCatalog.getString('Likelihood'),
        severity: gettextCatalog.getString('Total Risk')
    };

    // pre compute this so the digest cycles dont re-run iconClass
    // we really only use this once since the refactor
    // it is nice an delcaritive though, leaving it in for now
    priv.sevClassMap = {
        // for now handle the stringed severity... this will go away once sevs are 1 - 4
        INFO: priv.iconClass(1),
        WARN: priv.iconClass(2),
        ERROR: priv.iconClass(3),
        CRITICAL: priv.iconClass(4),
        UNKNOWN: priv.iconClass(-1),
        1: priv.iconClass(1),
        2: priv.iconClass(2),
        3: priv.iconClass(3),
        4: priv.iconClass(4)
    };

    // init the var on the scope
    // it should not change and there is no point in re calculating it
    $scope.init = function init () {
        if (!$scope.severity) {
            $scope.severity = 'UNKNOWN';
        }

        // if a type is specified and the label is not overridden
        // set the label per the typeMap
        if ($scope.type && !$scope.label) {
            $scope.label = priv.typeMap[$scope.type];
        }

        $scope.sevClass = priv.sevClassMap[$scope.severity];
    };
}

function severityIcon () {
    return {
        scope: {
            type: '@',
            label: '@',
            severity: '<'
        },
        templateUrl: 'js/components/severityIcon/severityIcon.html',
        restrict: 'E',
        replace: true,
        controller: severityIconCtrl
    };
}

componentsModule.directive('severityIcon', severityIcon);
