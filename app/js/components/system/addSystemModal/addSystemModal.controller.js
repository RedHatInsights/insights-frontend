'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function AddSystemModalCtrl($scope, $modalInstance) {
    $scope.close = function () {
        $modalInstance.dismiss('close');
    };
}

componentsModule.controller('AddSystemModalCtrl', AddSystemModalCtrl);
