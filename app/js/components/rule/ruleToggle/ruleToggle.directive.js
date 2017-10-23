'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleToggleCtrl($scope, Ack, InsightsConfig, gettextCatalog) {
    function init() {
        $scope.text = gettextCatalog.getString('Ignore Rule');
        if ($scope.rule && $scope.rule.ack_id) {
            $scope.text = gettextCatalog.getString('Unignore Rule');
        }
    }

    $scope.ackAction = function () {
        if ($scope.rule && $scope.rule.ack_id) {

            Ack.deleteAck({id:$scope.rule.ack_id});
            $scope.rule.ack_id = null;
        } else {
            Ack.createAck($scope.rule).then(function (ack) {
                $scope.rule.ack_id = ack.id;
            });
        }
    };

    init();
    $scope.$watch('rule.ack_id', init);
}

function ruleToggle() {
    return {
        templateUrl: 'js/components/rule/ruleToggle/ruleToggle.html',
        restrict: 'E',
        scope: {
            rule: '='
        },
        controller: ruleToggleCtrl
    };
}

componentsModule.directive('ruleToggle', ruleToggle);
