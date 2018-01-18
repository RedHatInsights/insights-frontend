'use strict';

var componentsModule = require('../../');
const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;

function ruleGroupCardCtrl ($scope, $timeout, $document, InsightsConfig) {
    var active = false;
    $scope.config = InsightsConfig;

    $scope.setActive = function (val) {
        active = val;
    };

    function keydownHandler ($event) {
        $scope.$evalAsync(function () {
            if (active) {
                if ($event.keyCode === LEFT_ARROW_KEY) {
                    $scope.previous();
                }

                if ($event.keyCode === RIGHT_ARROW_KEY) {
                    $scope.next();
                }
            }
        });
    }

    $document.on('keydown', keydownHandler);
    $scope.$on('$destroy', function () {
        $document.off('keydown', keydownHandler);
    });

    // triggers CSS effect
    function doEffect () {
        $scope.swapping = true;
        $timeout(function () {
            $scope.swapping = false;
        }, 0);
    }

    $scope.index = 0;

    $scope.$watch('plugin', function (value) {
        if (value) {
            $scope.rule = value.rules[$scope.index];
        }
    });

    $scope.hasNext = function () {
        return $scope.index + 1 < $scope.plugin.rules.length;
    };

    $scope.next = function () {
        if ($scope.hasNext()) {
            $scope.index++;
            $scope.rule = $scope.plugin.rules[$scope.index];
            doEffect();
        }
    };

    $scope.hasPrevious = function () {
        return $scope.index > 0;
    };

    $scope.previous = function () {
        if ($scope.hasPrevious()) {
            $scope.index--;
            $scope.rule = $scope.plugin.rules[$scope.index];
            doEffect();
        }
    };
}

/**
 * @ngInject
 */
function ruleGroupCard() {
    return {
        templateUrl: 'js/components/rule/ruleGroupCard/ruleGroupCard.html',
        restrict: 'E',
        scope: {
            plugin: '='
        },
        controller: ruleGroupCardCtrl
    };
}

componentsModule.directive('ruleGroupCard', ruleGroupCard);
