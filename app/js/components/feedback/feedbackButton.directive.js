'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function feedbackButtonCtrl($scope, $state, $location, $modal, User) {
    $scope.openFeedbackPage = function () {
        User.asyncCurrent(function (user) {
            $modal.open({
                templateUrl: 'js/components/feedback/feedbackModal.html',
                windowClass: 'system-modal ng-animate-enabled',
                backdropClass: 'ng-animate-enabled',
                controller: 'feedbackModalCtrl',
                resolve: {
                    feedbackInfo: function () {
                        return {
                            fromPage: $location.url(),
                            fromState: $state.current.name,
                            user: user
                        };
                    }
                }
            });
        });
    };
}

function feedbackButton() {
    return {
        templateUrl: 'js/components/feedback/feedbackButton.html',
        restrict: 'E',
        controller: feedbackButtonCtrl,
        replace: false
    };
}

componentsModule.directive('feedbackButton', feedbackButton);
