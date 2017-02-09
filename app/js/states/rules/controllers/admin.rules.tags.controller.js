'use strict';

var statesModule = require('../../');

/**
 * @ngInject
 */
function AdminRuleTagCtrl($scope) {
    $scope.tags = [];

    $scope.setTags = function (tags) {
        $scope.tags = tags;
    };
}

statesModule.controller('AdminRuleTagCtrl', AdminRuleTagCtrl);
