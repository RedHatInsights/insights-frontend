'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function otherTopic () {
    return {
        templateUrl: 'js/components/topics/otherTopic/otherTopic.html',
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            topic: '='
        }
    };
}

componentsModule.directive('otherTopic', otherTopic);
