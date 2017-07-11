'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function topicDetails ($rootScope) {
    return {
        templateUrl: 'js/components/topics/topicDetails/topicDetails.html',
        restrict: 'E',
        replace: false,
        scope: {
            topic: '='
        },
        link: function (scope) {
            $rootScope.$watch('isContentManager', function (value) {
                scope.isContentManager = value;
            });
        }
    };
}

componentsModule.directive('topicDetails', topicDetails);
