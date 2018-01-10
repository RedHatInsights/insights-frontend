'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function buttonFeedbackCrtl($scope, $state, $location, $modal, User) {
    $scope.openFeedbackPage = function () {
        User.asyncCurrent(function (user) {
            $modal.open({
                templateUrl: 'js/components/button-feedback/modal-feedback.html',
                windowClass: 'system-modal ng-animate-enabled',
                backdropClass: 'ng-animate-enabled',
                controller: 'modalFeedbackCtrl',
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

function buttonFeedback() {
    return {
        templateUrl: 'js/components/button-feedback/button-feedback.html',
        restrict: 'E',
        controller: buttonFeedbackCrtl,
        replace: true
    };
}

componentsModule.directive('buttonFeedback', buttonFeedback);
