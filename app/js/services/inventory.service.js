'use strict';

var servicesModule = require('./');

function InventoryService($modal, FilterService, System, InsightsConfig) {
    var inventoryService = {};
    var _sort = {
        field: 'toString',
        direction: 'ASC'
    };
    var _total = 0;

    inventoryService.loading = true;
    inventoryService.allExpanded = false;

    inventoryService.getSortField = function () {
        return _sort.field;
    };

    inventoryService.setSortField = function (field) {
        _sort.field = field;
        FilterService.setQueryParam('sort_field', field);
    };

    inventoryService.getSortDirection = function () {
        return _sort.direction;
    };

    inventoryService.setSortDirection = function (direction) {
        _sort.direction = direction;
        FilterService.setQueryParam('sort_dir', direction);
    };

    inventoryService.toggleSortDirection = function () {
        _sort.direction = (_sort.direction === 'ASC') ? 'DESC' : 'ASC';
        FilterService.setQueryParam('sort_dir', _sort.direction);
    };

    inventoryService.getSort = function () {
        return _sort;
    };

    inventoryService.setSort = function (sort) {
        _sort = sort;
        FilterService.setQueryParam('sort_dir', sort.direction);
        FilterService.setQueryParam('sort_field', sort.field);
    };

    inventoryService.setTotal = function (total) {
        _total = total;
    };

    inventoryService.getTotal = function () {
        return _total;
    };

    inventoryService._systemModal = null;

    inventoryService.showSystemModal = function (system, loadSystem) {

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
