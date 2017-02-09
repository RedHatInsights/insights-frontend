'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function statusIconCtrl($scope) {
    $scope.statusClass = '';
    if ($scope.status) {
        $scope.statusClass = 'fa-check-circle-o';
    } else {
        $scope.statusClass = 'fa-circle-o';
    }
}

function statusIcon() {
    return {
        scope: {
            status: '='
        },
        templateUrl: 'js/components/statusIcon/statusIcon.html',
        restrict: 'E',
        replace: true,
        controller: statusIconCtrl
    };
}

componentsModule.directive('statusIcon', statusIcon);
