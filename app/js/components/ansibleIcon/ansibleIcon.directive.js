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
            if ($scope.white) {
                $scope.icon = 'static/images/l_ansible-white.svg';
            } else {
                $scope.icon = 'static/images/l_ansible-blue.svg';
            }
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

    $scope.supportText = ($scope.positive) ? 'Ansible unsupported' : 'Ansible supported';
    $scope.svgClass = ($scope.white) ? 'ansible-icon-white' : 'ansible-icon';
}

function ansibleIcon() {
    return {
        scope: {
            value: '=',
            showTooltip: '=',
            showPlannerLine: '=',
            white: '<',
            hideLabel: '<'
        },
        templateUrl: 'js/components/ansibleIcon/ansibleIcon.html',
        restrict: 'E',
        replace: true,
        controller: ansibleIconCtrl
    };
}

componentsModule.directive('ansibleIcon', ansibleIcon);
