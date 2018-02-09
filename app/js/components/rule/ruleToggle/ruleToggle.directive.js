/*global require, module*/
'use strict';

const componentsModule = require('../../');
const pub = {};

pub.ackAction = ($scope, Ack) => {
    return () => {
        if ($scope.rule && $scope.rule.ack_id) {
            Ack.deleteAck({id: $scope.rule.ack_id});
            $scope.rule.ack_id = null;
        } else {
            Ack.createAck($scope.rule).then(function (ack) {
                $scope.rule.ack_id = ack.id;
            });
        }
    };
};

pub.init = ($scope, gettextCatalog) => {
    $scope.text = gettextCatalog.getString('Ignore Rule');
    if ($scope.rule && $scope.rule.ack_id) {
        $scope.text = gettextCatalog.getString('Unignore Rule');
    }

};

/**
 * @ngInject
 */
function ruleToggleCtrl($scope, Ack, InsightsConfig, gettextCatalog) {
    $scope.ackAction = pub.ackAction($scope, Ack);

    pub.init($scope, gettextCatalog)();

    $scope.$watch('rule.ack_id', pub.init($scope, gettextCatalog));
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

if (componentsModule.testMode) {
    module.exports.pub = pub;
}
