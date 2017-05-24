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
            title: '@',
            isIncident: '=',
            includeIncidents: '=',
            topic: '@'
        }
    };
}

componentsModule.directive('topicSummary', topicSummary);
