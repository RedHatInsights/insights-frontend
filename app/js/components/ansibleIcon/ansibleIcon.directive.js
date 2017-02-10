'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function ansibleIconCtrl($scope, gettextCatalog) {
    $scope.$watch('value', function (value) {
        if (value) {
            $scope.icon = 'images/l_ansible-blue.svg';
            $scope.tooltip = gettextCatalog.getString(
                'This rule has Ansible support. ' +
                'Use the Planner to generate an Ansible playbook.');
        } else {
            $scope.icon = 'images/l_ansible-unsupported.svg';
            $scope.tooltip = gettextCatalog
                .getString('This rules does not have Ansible support');
        }
    });
}

function ansibleIcon() {
    return {
        scope: {
            value: '='
        },
        templateUrl: 'js/components/ansibleIcon/ansibleIcon.html',
        restrict: 'E',
        replace: true,
        controller: ansibleIconCtrl
    };
}

componentsModule.directive('ansibleIcon', ansibleIcon);
