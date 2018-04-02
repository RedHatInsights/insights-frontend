'use strict';

var componentsModule = require('../');
var find = require('lodash/find');
var demoData = require('../../demoData');

/**
 * @ngInject
 */
function typeIconCtrl($scope) {
    var systemType = find(demoData.systemTypes, {id: parseInt($scope.typeId)});

    $scope.systemTypeIcon = '';
    $scope.systemTypeDisplayName = '';
    $scope.systemTypeDisplayNameShort = '';

    // SystemsService.getSystemTypeAsync($scope.typeId).then(function (systemType) {
    //     if (systemType) {
    //         $scope.systemTypeIcon = systemType.imageClass;
    //         $scope.systemTypeDisplayName = systemType.displayName;
    //         $scope.systemTypeDisplayNameShort = systemType.displayNameShort;
    //     }
    // });
    //

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
