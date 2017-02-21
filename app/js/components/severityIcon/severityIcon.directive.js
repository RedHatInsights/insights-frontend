'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function severityIconCtrl($scope, gettextCatalog) {
    $scope.$watch('severity', function (severity) {
        if (severity === 'INFO') {
            $scope.iconClass = 'i-info fa-info-circle';
            $scope.labelClass = 'i-info';
            $scope.labelValue = gettextCatalog.getString('Low');
        } else if (severity === 'WARN') {
            $scope.iconClass = 'i-warning fa-warning';
            $scope.labelClass = 'i-warning';
            $scope.labelValue = gettextCatalog.getString('Medium');
        } else if (severity === 'ERROR') {
            $scope.iconClass = 'i-error fa-times-circle';
            $scope.labelClass = 'i-error';
            $scope.labelValue = gettextCatalog.getString('High');
        } else if (severity === 'CRITICAL') {
            $scope.iconClass = 'fa-bomb';
            $scope.labelClass = '';
            $scope.labelValue = gettextCatalog.getString('Critical');
        } else {
            $scope.iconClass = '';
            $scope.labelClass = '';
        }
    });
}

function severityIcon() {
    return {
        scope: {
            severity: '=',
            label: '='
        },
        templateUrl: 'js/components/severityIcon/severityIcon.html',
        restrict: 'EC',
        replace: true,
        controller: severityIconCtrl
    };
}

componentsModule.directive('severityIcon', severityIcon);
