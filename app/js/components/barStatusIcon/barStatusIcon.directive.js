/*global require*/
'use strict';

const componentsModule = require('../');

/**
 * @ngInject
 */

//TODO turn this into a static 3 bar icon to do 1/2/3/4 bars according.
function barStatusIconCtrl($scope) {

    switch ($scope.status) {
        case 'ok':
            $scope.statusClass = 'i-success';
            break;
        case 'warning':
            $scope.statusClass = 'i-warning';
            break;
        case 'error':
            $scope.statusClass = 'i-error';
            break;
    }

}

function barStatusIcon() {
    return {
        scope: {
            status: '='
        },
        templateUrl: 'js/components/barStatusIcon/barStatusIcon.html',
        restrict: 'E',
        replace: true,
        controller: barStatusIconCtrl
    };
}

componentsModule.directive('barStatusIcon', barStatusIcon);
