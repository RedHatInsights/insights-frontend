'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function typeIconCtrl($scope, SystemsService) {
    $scope.systemTypeIcon = '';
    $scope.systemTypeDisplayName = '';
    $scope.systemTypeDisplayNameShort = '';
    let systemType = SystemsService.getSystemType($scope.typeId);

    if (systemType) {
        $scope.systemTypeIcon = systemType.imageClass;
        $scope.systemTypeDisplayName = systemType.displayName;
        $scope.systemTypeDisplayNameShort = systemType.displayNameShort;
    }
}

function typeIcon() {
    return {
        scope: {
            typeId: '=',
            includeText: '='
        },
        templateUrl: 'js/components/typeIcon/typeIcon.html',
        restrict: 'EC',
        replace: true,
        controller: typeIconCtrl
    };
}

componentsModule.directive('typeIcon', typeIcon);
