'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function feedbackModalCtrl($scope, $modalInstance, feedbackInfo, Feedback) {
    $scope.feedbackInfo = feedbackInfo;
    $scope.isError = false;

    $scope.setEmailOverride = function () {
        $scope.emailOverride = true;
    };

    $scope.isCommentPopulated = function () {
        return ($scope.comment !== '' && $scope.comment !== undefined);
    };

    $scope.submitForm = function () {
        var formData = {
            comment: $scope.comment,
            email: $scope.feedbackInfo.user.email,
            from_page: feedbackInfo.fromPage
        };

        Feedback.sendFeedback(formData).success(function () {
            $scope.close();
        }).catch(function () {
            $scope.isError = true;
        });

        return;
    };

    $scope.close = function () {
        $modalInstance.dismiss('close');
    };
}

componentsModule.controller('feedbackModalCtrl', feedbackModalCtrl);
