'use strict';

var servicesModule = require('./');

function InventoryService($modal, FilterService, System, InsightsConfig) {
    var inventoryService = {};
    var _total = 0;

    inventoryService.loading = true;
    inventoryService.allExpanded = false;

    inventoryService.setTotal = function (total) {
        _total = total;
    };

    inventoryService.getTotal = function () {
        return _total;
    };

    inventoryService._systemModal = null;

    inventoryService.showSystemModal = function (system, loadSystem, activeTab) {

        function displayModal(system) {
            if (typeof InsightsConfig.systemShowSystem === 'function') {
                InsightsConfig.systemShowSystem(system);
                return;
            }

            function openModal(opts) {
                if (inventoryService._systemModal) {
                    return; // Only one modal at a time please
                }

                inventoryService._systemModal = $modal.open(opts);
                inventoryService._systemModal.result.finally(function () {
                    inventoryService._systemModal = null;
                });
            }

            openModal({
                templateUrl: 'js/components/system/systemModal/systemModal.html',
                windowClass: 'system-modal ng-animate-enabled',
                backdropClass: 'system-backdrop ng-animate-enabled',
                controller: 'SystemModalCtrl',
                resolve: {
                    system: function () {
                        return system;
                    },

                    rule: function () {
                        return false;
                    },

                    activeTab: function () {
                        return activeTab;
                    }
                }
            });
        }

        if (loadSystem) {
            System.getSingleSystem(system.system_id).then(function (system) {
                displayModal(system.data);
            });
        } else {
            displayModal(system);
        }

    };

    return inventoryService;
}

servicesModule.factory('InventoryService', InventoryService);
