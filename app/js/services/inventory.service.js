'use strict';

var servicesModule = require('./');

function InventoryService($location, $modal, FilterService) {
    var inventoryService = {};
    var _sort = {
        field: 'toString',
        direction: 'ASC'
    };
    var _page = 0;
    var _pageSize = 15;
    var _isScrolling = false;
    var _total = 0;
    var _accountProducts = [];

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
    };

    inventoryService.getSort = function () {
        return _sort;
    };

    inventoryService.setSort = function (sort) {
        _sort = sort;
        FilterService.setQueryParam('sort_dir', sort.direction);
        FilterService.setQueryParam('sort_field', sort.field);
    };

    inventoryService.getPage = function () {
        return _page;
    };

    inventoryService.setPage = function (page) {
        _page = page;
    };

    inventoryService.setPageSize = function (pageSize) {
        _pageSize = pageSize;
    };

    inventoryService.getPageSize = function () {
        return _pageSize;
    };

    inventoryService.getIsScrolling = function () {
        return _isScrolling;
    };

    inventoryService.setIsScrolling = function (isScrolling) {
        _isScrolling = isScrolling;
    };

    inventoryService.nextPage = function () {
        _page = _page + 1;
    };

    inventoryService.previousPage = function () {
        _page = _page - 1;
    };

    inventoryService.goToPage = function (pageNum) {
        _page = pageNum;
    };

    inventoryService.setTotal = function (total) {
        _total = total;
    };

    inventoryService.getTotal = function () {
        return _total;
    };

    inventoryService.setAccountProducts = function (accountProducts) {
        _accountProducts = accountProducts;
    };

    inventoryService.getAccountProducts = function () {
        return _accountProducts;
    };

    inventoryService._systemModal = null;

    inventoryService.showSystemModal = function (system) {

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
    };

    return inventoryService;
}

servicesModule.factory('InventoryService', InventoryService);
