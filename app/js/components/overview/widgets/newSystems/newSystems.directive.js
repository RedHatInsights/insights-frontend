'use strict';

var componentsModule = require('../../../');

/**
 * @ngInject
 */
function NewSystemsCtrl($scope, SystemsService, Utils, InventoryService) {

    $scope.loader = new Utils.Loader(false);
    $scope.showSystemModal = InventoryService.showSystemModal;

    const load = $scope.loader.bind(function () {
        // currently the product selection is not reflected within the newest systems
        // as there is on notion of product on the overview page yet
        return SystemsService.populateNewestSystems().then(function () {
            $scope.systems = SystemsService.getNewestSystems();
        });
    });

    $scope.$on('account:change', load);
    load();
}

function newSystems() {
    return {
        templateUrl: 'js/components/overview/widgets/newSystems/newSystems.html',
        restrict: 'E',
        replace: true,
        scope: {},
        controller: NewSystemsCtrl
    };
}

componentsModule.directive('newSystems', newSystems);
