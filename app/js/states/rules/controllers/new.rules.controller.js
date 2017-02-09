'use strict';

var statesModule = require('../../');

/**
 * @ngInject
 */
function NewRuleCtrl($scope, Rule) {
    $scope.rule = {
        severity: 'INFO',
        category: 'Stability'
    };

    $scope.saveFn = function () {
        Rule.create($scope.rule).success(function (rule) {
            console.log('created rule', rule);
        });
    };
}

statesModule.controller('NewRuleCtrl', NewRuleCtrl);
