'use strict';

var componentsModule = require('../../');

function ruleResolutionCtrl(RhaTelemetryActionsService, $scope) {

    $scope.getSystemNameFromId = function (systemId) {
        var systemNames = RhaTelemetryActionsService.getSystemNames();
        if (systemNames && systemNames.hasOwnProperty(systemId)) {
            return systemNames[systemId];
        } else {
            return systemId;
        }
    };
}

/**
 * @ngInject
 */
function ruleResolution() {
    return {
        templateUrl: 'js/components/rule/ruleResolution/ruleResolution.html',
        restrict: 'EC',
        replace: false,
        controller: ruleResolutionCtrl
    };
}

componentsModule.directive('ruleResolution', ruleResolution);
