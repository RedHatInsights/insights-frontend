/*global require*/
'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function insButtonSplit() {
    return {
        templateUrl: 'js/components/buttons/ins-button-split/ins-button-split.html',
        restrict: 'E',
        replace: true,
        controller: angular.noop,
        controllerAs: 'ctrl',
        scope: {
            disabled: '=?ngDisabled'
        },
        transclude: {
            main: 'insButtonSplitMain',
            items: 'insButtonSplitItem'
        },
        link: function ($scope, $element, $attr, ctrl) {
            ctrl.classes = $attr.class;
            $scope.$watch('disabled', function (value) {
                ctrl.disabled = value;
            });
        }
    };
}

/**
 * @ngInject
 */
function insButtonSplitMain() {
    return {
        templateUrl: 'js/components/buttons/ins-button-split/ins-button-split-main.html',
        restrict: 'E',
        replace: false,
        transclude: true,
        require: '^insButtonSplit',
        link: function ($scope, element, attr, ctrl) {
            $scope.ctrl = ctrl;
        }
    };
}

/**
 * @ngInject
 */
function insButtonSplitItem() {
    return {
        templateUrl: 'js/components/buttons/ins-button-split/ins-button-split-item.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        require: '^insButtonSplit'
    };
}

componentsModule.directive('insButtonSplit', insButtonSplit);
componentsModule.directive('insButtonSplitItem', insButtonSplitItem);
componentsModule.directive('insButtonSplitMain',  insButtonSplitMain);
