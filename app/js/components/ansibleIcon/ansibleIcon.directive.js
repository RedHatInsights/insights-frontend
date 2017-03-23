'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function ansibleIconCtrl($scope, gettextCatalog) {
    const plannerLine = gettextCatalog.getString(
        'Use the Planner to generate an Ansible Playbook.');
    const possitive = gettextCatalog.getString('This rule has Ansible support.');
    const negative = gettextCatalog.getString('This rules does not have Ansible support');

    $scope.$watch('value', function (value) {
        if (value) {
            $scope.icon = 'images/l_ansible-blue.svg';

        } else {
            $scope.icon = 'images/l_ansible-unsupported.svg';
        }

        if ($scope.showTooltip || $scope.showTooltip === undefined) {
            if (value) {
                $scope.tooltip = possitive;
                if ($scope.showPlannerLine || $scope.showPlannerLine === undefined) {
                    $scope.tooltip += ' ' + plannerLine;
                }
            } else {
                $scope.tooltip = negative;
            }
        }
    });
}

function ansibleIcon() {
    return {
        scope: {
            value: '=',
            showTooltip: '=',
            showPlannerLine: '='
        },
        templateUrl: 'js/components/ansibleIcon/ansibleIcon.html',
        restrict: 'E',
        replace: true,
        controller: ansibleIconCtrl
    };
}

componentsModule.directive('ansibleIcon', ansibleIcon);
