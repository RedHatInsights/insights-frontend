/*global require*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function TrimmedTextCtrl($scope) {
    $scope.showTooltip = false;
    if ($scope.text.length > $scope.length) {
        $scope.trimmedText = $scope.text.slice(0, $scope.length) + '…';
        $scope.showTooltip = true;
    } else {
        $scope.trimmedText = $scope.text;
    }
}

function trimmedText() {
    return {
        templateUrl: 'js/components/misc/trimmedText/trimmedText.html',
        restrict: 'E',
        replace: false,
        transclude: true,
        controller: TrimmedTextCtrl,
        scope: {
            length: '@',
            text: '@'
        }
    };
}

componentsModule.directive('trimmedText', trimmedText);
