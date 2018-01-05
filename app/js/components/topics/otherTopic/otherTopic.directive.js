'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function otherTopic (FilterService) {
    return {
        templateUrl: 'js/components/topics/otherTopic/otherTopic.html',
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            topic: '='
        },
        link: function (scope) {
            scope.getSelectedProduct = FilterService.getSelectedProduct;
        }
    };
}

componentsModule.directive('otherTopic', otherTopic);
