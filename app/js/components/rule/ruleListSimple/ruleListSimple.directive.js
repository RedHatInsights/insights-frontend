'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleListSimple() {
    return {
        templateUrl: 'js/components/rule/ruleListSimple/ruleListSimple.html',
        restrict: 'E',
        scope: {
            rules: '=',
            onDelete: '&',
            onSelect: '&',
            order: '='
        },
        link: function (scope, element, attrs) {
            scope.readOnly = !attrs.onDelete;
            scope.$watch('rules', function () {
                scope.limit = 10;
            });
        }
    };
}

componentsModule.directive('ruleListSimple', ruleListSimple);
