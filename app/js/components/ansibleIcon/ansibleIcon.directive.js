/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function ansibleIconCtrl($scope, gettextCatalog) {
    const plannerLine = gettextCatalog.getString(
        'Use the Planner to generate an Ansible Playbook.');
    const positive = gettextCatalog.getString('This rule has Ansible support.');
    const negative = gettextCatalog.getString('This rules does not have Ansible support');

    $scope.$watch('value', function (value) {
        if (value) {
            $scope.icon = 'static/images/l_ansible-blue.svg';

        } else {
            $scope.icon = 'static/images/l_ansible-unsupported.svg';
        }

        if ($scope.showTooltip || $scope.showTooltip === undefined) {
            if (value) {
                $scope.tooltip = positive;
                if ($scope.showPlannerLine || $scope.showPlannerLine === undefined) {
                    $scope.tooltip += ` ${plannerLine}`;
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
        replace: false,
        controller: ansibleIconCtrl
    };
}

componentsModule.directive('ansibleIcon', ansibleIcon);
