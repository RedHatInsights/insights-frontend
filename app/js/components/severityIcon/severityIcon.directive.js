/*global require*/
'use strict';

const componentsModule = require('../');
const has = require('lodash/object/has');

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

    priv.checkTypes = function () {
        // check to ensure a valid type is given!
        if ($scope.type && $scope.type) {
            if (has(priv.typeMap, $scope.type)) {
                return;
            }

            throw new Error('Invalid severity-icon type selected! ' + $scope.type);
        }

        throw new Error('No severity-icon type selected! ' + $scope.type);
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

    priv.numberToStringMap = {
        1: gettextCatalog.getString('Low'),
        2: gettextCatalog.getString('Medium'),
        3: gettextCatalog.getString('High'),
        4: gettextCatalog.getString('Critical'),
        INFO: gettextCatalog.getString('Low'),
        WARN: gettextCatalog.getString('Medium'),
        ERROR: gettextCatalog.getString('High'),
        CRITICAL: gettextCatalog.getString('Critical'),
        UNKNOWN: gettextCatalog.getString('Unknown')
    };

    // init the var on the scope
    // it should not change and there is no point in re calculating it
    $scope.init = function init () {
        priv.checkTypes();

        if (!$scope.severity) {
            $scope.severity = 'UNKNOWN';
        }

        // this is a hack to support ERROR to 4 in the hamburger
        // until critical sev is supported properly
        if ($scope.type && $scope.type === 'severity') {
            if ($scope.severity === 'ERROR' || $scope.severity === 3) {
                $scope.severity = 4;
            }
        }

        // if a type is specified and the label is not overridden
        // set the label per the typeMap
        if ($scope.type && !$scope.label) {
            $scope.label = priv.typeMap[$scope.type];
        }

        $scope.tooltip = `${priv.typeMap[$scope.type]}: ` +
            `${priv.numberToStringMap[$scope.severity]}`;
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
