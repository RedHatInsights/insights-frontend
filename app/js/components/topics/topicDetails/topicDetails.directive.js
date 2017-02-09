'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function topicDetails ($rootScope) {
    return {
        templateUrl: 'js/components/topics/topicDetails/topicDetails.html',
        restrict: 'E',
        replace: true,
        scope: {
            topic: '='
        },
        link: function (scope) {
            scope.isContentManager = $rootScope.isContentManager;
        }
    };
}

componentsModule.directive('topicDetails', topicDetails);
