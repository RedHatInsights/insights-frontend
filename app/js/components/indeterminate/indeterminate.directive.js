'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function ngIndeterminate() {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            scope.$watch(attributes.ngIndeterminate, function (value) {
                element.prop('indeterminate', !!value);
            });
        }
    };
}

componentsModule.directive('ngIndeterminate', ngIndeterminate);
