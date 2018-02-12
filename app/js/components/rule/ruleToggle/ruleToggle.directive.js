/*global require, module*/
'use strict';

const componentsModule = require('../../');
const pub = {};
const priv = {
    text: {
        UNIGNORE_RULE: 'Unignore Rule',
        IGNORE_RULE: 'Ignore Rule'
    }
};

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
    $scope.text = gettextCatalog.getString(priv.text.IGNORE_RULE);
    if ($scope.rule && $scope.rule.ack_id) {
        $scope.text = gettextCatalog.getString(priv.text.UNIGNORE_RULE);
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
    module.exports.priv = priv;
}
