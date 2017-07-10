'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function ModalUtils ($rootScope, $timeout) {

    function suppressEscNavigation ($modalInstance) {
        let escUnreg = $rootScope.$on('telemetry:esc', function ($event) {
            $event.preventDefault();
            return false;
        });

        $modalInstance.result.then(angular.noop, function () {
            // defer unregistering of the esc suppressor
            $timeout(function () {
                escUnreg();
            });
        });
    }

    function preventModalCloseOnEsc ($scope) {
        return $scope.$on('modal.closing', function (event, reason) {
            if (reason === 'escape key press') {
                event.preventDefault();
            }
        });
    }

    return {
        suppressEscNavigation: suppressEscNavigation,
        preventModalCloseOnEsc
    };
}

servicesModule.service('ModalUtils', ModalUtils);
