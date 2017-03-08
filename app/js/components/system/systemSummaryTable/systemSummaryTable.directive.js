'use strict';

var componentsModule = require('../../');

var filter = require('lodash/collection/filter');
var findWhere = require('lodash/collection/findWhere');
var isString = require('lodash/lang/isString');
var isEmpty = require('lodash/lang/isEmpty');
var sortby = require('lodash/collection/sortBy');

/**
 * @ngInject
 */

function systemSummaryTableCtrl(
    $scope,
    $state,
    $filter,
    $modal,
    $location,
    System,
    NgTableParams,
    SweetAlert,
    Utils,
    InsightsConfig,
    gettextCatalog,
    PreferenceService,
    User) {

    $scope.canUnregisterSystems = true;
    $scope.getSystemsLabel = PreferenceService.getSystemsLabel;

    $scope.systemToString = function (system) {
        return Utils.getSystemDisplayName(system);
    };

    $scope.isOspMode = function () {
        return PreferenceService.get('dashboard_mode') === 'osp';
    };

    $scope.getNumCols = function () {
        let numCols = 3;
        if (PreferenceService.get('dashboard_mode') === 'osp') {
            numCols = 4;
        }

        return numCols;
    };

    let lastClicked;
    $scope.checkboxes = {
        checked: false,
        items: {}
    };

    if (typeof InsightsConfig.canUnregisterSystems === 'boolean') {
        $scope.canUnregisterSystems = InsightsConfig.canUnregisterSystems;
    } else if (typeof InsightsConfig.canUnregisterSystems === 'function') {
        // set to false while we wait for the callback
        $scope.canUnregisterSystems = false;
        InsightsConfig.canUnregisterSystems(function (can) {
            $scope.canUnregisterSystems = can;
        });
    }

    let data = $scope.systems || [];
    let filtered_data = data;

    let sortRegex = /(\+|-)/;
    $scope.filters = {
        hostname: ''
    };
    let systemModal = null;

    function getSort() {
        var search = $location.search();
        if (search.sort) {
            let sortObj = {
                sorting: {}
            };
            sortObj.sorting[search.sort] = (search.dir || 'desc');
            return sortObj;
        }
    }

    function setSort(sort) {
        if ($state.current.name !== 'app.systems') {
            return;
        }

        if (sort && sort.length) {
            sort = sort[0].split(sortRegex);
            if (sort.length !== 3) {
                // not sure how the heck we would have gotten here
                return;
            }

            let sortObj = {
                sort: sort[2],
                dir: (sort[1] === '+') ? 'asc' : 'desc'
            };
            let currentSearch = $location.search();
            $location.replace();

            if (currentSearch.ospProducts) {
                sortObj.ospProducts = currentSearch.ospProducts;
            }

            if (currentSearch.standaloneProducts) {
                sortObj.standaloneProducts = currentSearch.standaloneProducts;
            }

            $location.search(sortObj);
        }
    }

    function applyProductFilter(systems) {
        var filtered_systems = [];
        var selectedCluster = null;
        var dashboardMode = PreferenceService.get('dashboard_mode');
        if (dashboardMode === 'osp') {
            selectedCluster = PreferenceService.get('osp_deployment');
        }

        systems.forEach(function (system) {
            if (system.metadata && isString(system.metadata)) {
                system.metadata = JSON.parse(system.metadata);
            }

            if (dashboardMode === 'osp' && system.parent_id === selectedCluster) {
                filtered_systems.push(system);
            } else if ((dashboardMode === 'rhel' || dashboardMode === undefined) &&
                       !system.parent_id) {
                filtered_systems.push(system);
            }
        });

        return filtered_systems;
    }

    $scope.systemIsHeader = function (system) {
        var response = false;
        if (system &&
            system.metadata &&
            system.metadata.role &&
            system.metadata.role === 'header') {

            response = true;
        }

        return response;
    };

    let resetChecked = Utils.resetChecked($scope.checkboxes);
    let params = angular.extend({
        page: 1,
        count: 30,
        filter: $scope.filters,
        sorting: {
            last_check_in: 'desc'
        }
    }, getSort());
    $scope.tableParams = new NgTableParams(params, {
        total: data.length,
        counts: [],
        getData: function ($defer, params) {
            // Reset checkboxes
            resetChecked();
            setSort(params.orderBy());
            filtered_data = applyProductFilter(data);
            filtered_data = params.filter() ?
                $filter('filter')(filtered_data, params.filter().hostname) :
                filtered_data;
            filtered_data = params.sorting() ?
                $filter('orderBy')(filtered_data, params.orderBy()) :
                filtered_data;
            if ($scope.onlyOffline) {
                filtered_data = filter(filtered_data, function (d) {
                    // || isSlightlyStale(d.last_check_in)));
                    return (d.last_check_in && ($scope.isStale(d)));
                });
            }

            if ($scope.actionFilter && $scope.actionFilter === 'with') {
                filtered_data = filter(filtered_data, function (d) {
                    return (d.reports.length > 0);
                });
            } else if ($scope.actionFilter && $scope.actionFilter === 'without') {
                filtered_data = filter(filtered_data, function (d) {
                    return (d.reports.length === 0);
                });
            }

            let total = filtered_data.length;
            let currentPage = params.page();
            let perPage = params.count();

            // If we applied a filter, are not on page 1, and have less
            // than perpage we need to reset to the first page
            if (currentPage > 1 && total < perPage) {
                params.page(1);
                currentPage = 1;
            }

            params.total(total);

            //add headers for each type of osp role
            if (PreferenceService.get('dashboard_mode') === 'osp') {
                filtered_data = sortby(filtered_data, 'metadata.role').reverse();
                let prevSys = {metadata: {role: null}};
                let copiedData = angular.copy(filtered_data);
                let rolesAdded = 0;
                copiedData.forEach(function (sys, index) {
                    if (sys.metadata.role !== prevSys.metadata.role) {
                        filtered_data.splice(
                            index + rolesAdded, 0,
                            {
                                machine_id: sys.metadata.role,
                                metadata: {role: 'header'}
                            });
                        rolesAdded = rolesAdded + 1;
                    }

                    prevSys = sys;
                });
            } else {
                filtered_data = filtered_data.slice(
                    (currentPage - 1) * perPage, currentPage * perPage);
            }

            $defer.resolve(filtered_data);
        }
    });

    function initialDisplay() {
        var search = $location.search();
        var machine_id = search.machine;
        if (!machine_id) {
            return;
        }

        let system = findWhere(data, {
            machine_id: machine_id
        });
        if (system) {
            return $scope.showSystem(system);
        }
    }

    $scope.$watch('systems', function (systems) {
        if (systems) {
            data = systems;
            $scope.tableParams.total(data.length);
            reload();
            if (systems.length) {
                initialDisplay();
            }
        }
    });

    function reload() {
        $scope.tableParams.reload();
    }

    $scope.$on('productFilter:change', function () {
        if ($state.current.name === 'app.systems') {
            reload();
        }
    });

    $scope.$watch('onlyOffline', reload);
    $scope.$watch('actionFilter', reload);

    $scope.rowClick = function ($event, system) {
        if (system.metadata && system.metadata.role !== 'header') {
            let target = $event.target || $event.srcElement;
            if (target.tagName === 'A') {
                return;
            }

            if ($event.shiftKey && $event.type === 'mousedown') {
                // Prevents selection of rows on shift+click
                $event.preventDefault();
                return false;
            }

            if (target.tagName === 'TD' && $event.type === 'click') {
                $scope.checkboxes.items[system.system_id] =
                    !$scope.checkboxes.items[system.system_id];
            }

            target = $event.currentTarget;
            if (!lastClicked) {
                lastClicked = target;
                return;
            }

            if ($event.shiftKey) {
                Utils.selectBetween(target, lastClicked, $scope.checkboxes.items);
            }

            lastClicked = target;
        }
    };

    $scope.$watch('checkboxes.checked', function (value) {
        Utils.checkboxChecked(value, filtered_data, $scope.checkboxes.items);
    });

    function itemsChanged() {
        var result = Utils.itemsChanged(filtered_data, $scope.checkboxes.items);
        $scope.totalChecked = result.totalChecked;
        $scope.indeterminate = result.indeterminate;
        if (angular.isDefined(result.checked)) {
            $scope.checkboxes.checked = result.checked;
        }
    }

    $scope.$watchCollection('checkboxes.items', itemsChanged);

    $scope.showSystem = function (system) {
        if (typeof InsightsConfig.systemShowSystem === 'function') {
            return InsightsConfig.systemShowSystem(system);
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

    $scope.unregisterSystems = function () {
        var toDelete = [];
        for (let item in $scope.checkboxes.items) {
            if ($scope.checkboxes.items[item] === true) {
                toDelete.push(item);
            }
        }

        let count = toDelete.length;
        let message = gettextCatalog.getPlural(
            count,
            '<h5>This will unregister the selected system from Red Hat Insights.</h5>' +
            '<p>To undo this action' +
                '<code>redhat-access-insights --register</code>' +
                'must be run from the unregistered system.' +
            '</p>',
            '<h5>This will unregister the {{count}} ' +
                'selected systems from Red Hat Insights.' +
            '</h5>' +
            '<p>To undo this action ' +
                '<code>redhat-access-insights --register</code>' +
                'must be run from each unregistered system.' +
            '</p>', {
                count: count
            });

        SweetAlert.swal({
            title: 'Are you sure?',
            text: message,
            type: 'warning',
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            html: true,
            showCancelButton: true
        }, function (isConfirm) {
            if (isConfirm) {
                for (let i = 0; i < toDelete.length; i++) {
                    System.deleteSystem(toDelete[i]);
                }

                for (let i = data.length - 1; i >= 0; i--) {
                    let system = data[i];
                    if (toDelete.indexOf(system.machine_id) !== -1) {
                        data.splice(i, 1);
                        if ($scope.summary && system.reports && system.reports.length) {
                            $scope.summary.red--;
                        } else if ($scope.summary &&
                                   system.reports &&
                                   !system.reports.length) {

                            $scope.summary.green--;
                        }
                    }
                }

                $scope.tableParams.reload();
            }
        });
    };

    $scope.registerSystem = function () {
        var systemLimitReached = false;
        User.asyncCurrent(function (user) {
            systemLimitReached = user.current_entitlements ?
                user.current_entitlements.systemLimitReached :
                !user.is_internal;

            if (user.current_entitlements && user.current_entitlements.unlimitedRHEL) {
                systemLimitReached = false;
            }
        });

        openModal({
            templateUrl: 'js/components/system/addSystemModal/' +
                (systemLimitReached ? 'upgradeSubscription.html' : 'addSystemModal.html'),
            windowClass: 'system-modal ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'AddSystemModalCtrl'
        });
    };

    $scope.actionTooltip = function (count) {
        if (count === 1) {
            return '1 Action';
        }

        return (count + ' Actions');
    };

    function openModal(opts) {
        if (systemModal) {
            return; // Only one modal at a time please
        }

        systemModal = $modal.open(opts);
        systemModal.result.finally(function () {
            systemModal = null;
        });
    }

    $scope.isPortal = InsightsConfig.isPortal;
    $scope.cleanRole = function (metadata) {
        if (isString(metadata)) {
            metadata = JSON.parse(metadata);
        }

        if (!isEmpty(metadata)) {
            return metadata.role;
        } else {
            return undefined;
        }
    };

    $scope.showRegisterButton = function () {
        var response = false;
        if (!$scope.isOspMode() && $scope.isPortal) {
            response = true;
        }

        return response;
    };
}

function systemSummaryTable() {
    return {
        templateUrl: 'js/components/system/systemSummaryTable/systemSummaryTable.html',
        restrict: 'EC',
        scope: {
            systems: '=',
            summary: '=',
            onlyOffline: '=',
            actionFilter: '='
        },
        controller: systemSummaryTableCtrl
    };
}

componentsModule.directive('systemSummaryTable', systemSummaryTable);
