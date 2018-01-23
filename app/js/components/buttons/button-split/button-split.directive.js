/*global require*/
'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function buttonSplit() {
    return {
        templateUrl: 'js/components/buttons/button-split/button-split.html',
        restrict: 'E',
        replace: true,
        controller: angular.noop,
        controllerAs: 'ctrl',
        scope: {
            disabled: '=?ngDisabled'
        },
        transclude: {
            main: 'buttonSplitMain',
            items: 'buttonSplitItem'
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
function buttonSplitMain() {
    return {
        templateUrl: 'js/components/buttons/button-split/button-split-main.html',
        restrict: 'E',
        replace: false,
        transclude: true,
        require: '^buttonSplit',
        link: function ($scope, element, attr, ctrl) {
            $scope.ctrl = ctrl;
        }
    };
}

/**
 * @ngInject
 */
function buttonSplitItem() {
    return {
        templateUrl: 'js/components/buttons/button-split/button-split-item.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        require: '^buttonSplit'
    };
}

componentsModule.directive('buttonSplit', buttonSplit);
componentsModule.directive('buttonSplitItem', buttonSplitItem);
componentsModule.directive('buttonSplitMain',  buttonSplitMain);
