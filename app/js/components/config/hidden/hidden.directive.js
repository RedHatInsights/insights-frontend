'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function configHiddenCtrl($scope, Ack) {
    Ack.init();
    $scope.acks = Ack.acks;
    $scope.delete = Ack.deleteAck;
}

function configHidden() {
    return {
        templateUrl: 'js/components/config/hidden/hidden.html',
        restrict: 'EA',
        scope: {},
        controller: configHiddenCtrl
    };
}

componentsModule.directive('configHidden', configHidden);
