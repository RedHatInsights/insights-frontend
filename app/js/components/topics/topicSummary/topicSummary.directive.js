'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function topicSummary () {
    return {
        templateUrl: 'js/components/topics/topicSummary/topicSummary.html',
        restrict: 'E',
        replace: true,
        scope: {
            count: '@',
            title: '@'
        }
    };
}

componentsModule.directive('topicSummary', topicSummary);
