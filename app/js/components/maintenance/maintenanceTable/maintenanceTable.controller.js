'use strict';

var componentsModule = require('../../');
var isEmpty = require('lodash/lang/isEmpty');
var indexBy = require('lodash/keyBy');
var countBy = require('lodash/collection/countBy');
var reject = require('lodash/collection/reject');

/**
 * @ngInject
 */
function MaintenanceTable(
    $scope,
    $filter,
    Utils,
    MaintenanceService,
    SweetAlert,
    gettextCatalog) {

    var ctrl = this;

    ctrl.params = $scope.paramsCallback();
    ctrl.pager = new Utils.Pager();
    ctrl.sorter = new Utils.Sorter(ctrl.params.implicitOrder, order);
    ctrl.showSystemModal = MaintenanceService.showSystemModal;
    ctrl.loader = new Utils.Loader(false);

    $scope.checkboxes = new Utils.Checkboxes();
    $scope.checkboxRowClick = function (event, id) {
        if ($scope.edit) {
            $scope.checkboxes.rowClick(event, id);
        }
    };

    $scope.checkboxUpdate = function () {
        $scope.checkboxes.update(ctrl.filteredActions);
    };

    $scope.$watchCollection('checkboxes.items', $scope.checkboxUpdate);
    $scope.checkboxChecked = function () {
        if ($scope.checkboxes.checked) {
            let overlapCount =
                countBy(ctrl.filteredActions, '_type')
                [MaintenanceService.MAINTENANCE_ACTION_TYPE.PLANNED_ELSEWHERE];

            if (overlapCount) {
                return SweetAlert.swal({
                    title: gettextCatalog.getString('Select overlapping actions?'),
                    text: gettextCatalog.getPlural(overlapCount,
                        'This selection contains an action that  ' +
                        'is already part of another plan. ' +
                        'Do you want to include this action?',
                        'This selection contains {{count}} actions ' +
                        'that are already part of another plan. ' +
                        'Do you want to include these actions?',
                        {count: overlapCount}),
                    type: 'info',
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes',
                    showCancelButton: true,
                    cancelButtonText: 'No'
                }, function (isConfirm) {
                    var actions = ctrl.filteredActions;
                    if (!isConfirm) {
                        actions =
                            reject(actions, {
                                _type: MaintenanceService.
                                    MAINTENANCE_ACTION_TYPE.PLANNED_ELSEWHERE
                            });
                    }

                    $scope.checkboxes.checkboxChecked($scope.checkboxes.checked, actions);
                });
            }
        }

        $scope.checkboxes.checkboxChecked(
            $scope.checkboxes.checked, ctrl.filteredActions);
    };

    $scope.$watchGroup(['item', 'edit'], function () {
        ctrl.filter = {};
        evalActions();
    });

    /*
     * Data processing pipeline
     */
    /*jslint latedef:false*/
    function evalActions () {
        if (!$scope.item) {
            return;
        }

        ctrl.params = $scope.paramsCallback();
        ctrl.savedActions = ctrl.params.getActions();

        $scope.checkboxes.items = {};
        ctrl.savedActions.forEach(function (action) {
            $scope.checkboxes.items[action.id] = true;
            if (!angular.isDefined(action._type)) {
                action._type = MaintenanceService.MAINTENANCE_ACTION_TYPE.PLANNED;
            }
        });

        evalAvailableActions();
    }

    const evalAvailableActions = ctrl.loader.bind(function () {
        ctrl.actions = ctrl.savedActions;
        ctrl.doFilter();
        if ($scope.edit) {
            return ctrl.params.getAvailableActions().then(function (availableActions) {
                // prevents duplicates by filtering out
                // actions that are already part of the plan
                var savedActionsById = indexBy(ctrl.savedActions, 'id');
                availableActions = availableActions.filter(function (action) {
                    return !(action.id in savedActionsById);
                });

                availableActions.forEach(function (action) {
                    if (!angular.isDefined(action._type)) {
                        action._type =
                            MaintenanceService.MAINTENANCE_ACTION_TYPE.AVAILABLE;
                    }

                    if (action.selected) {
                        $scope.checkboxes.items[action.id] = true;
                    }
                });

                ctrl.actions = ctrl.savedActions.concat(availableActions);
                ctrl.doFilter();
            });
        }
    });

    ctrl.doFilter = function () {
        if (!isEmpty(ctrl.filter)) {
            ctrl.filteredActions = $filter('filter')(ctrl.actions, ctrl.filter);
        } else {
            ctrl.filteredActions = ctrl.actions;
        }

        $scope.checkboxUpdate();
        order();
    };

    function order() {
        ctrl.orderedActions = $filter('orderBy')(ctrl.filteredActions,
            ['_type',
            (ctrl.sorter.reverse ?
                '-' + ctrl.sorter.predicate :
                ctrl.sorter.predicate)]);
        ctrl.pager.reset();
        ctrl.page();
    }

    ctrl.page = function () {
        ctrl.pager.update();
        let data = $filter('offset')(ctrl.orderedActions, ctrl.pager.offset);
        data = $filter('limitTo')(data, ctrl.pager.perPage);
        ctrl.data = data;
    };

    /*
     * Controls
     */
    function save () {
        let toAdd = ctrl.actions.filter(function (action) {
            return action._type !==
                MaintenanceService.MAINTENANCE_ACTION_TYPE.PLANNED &&
                ($scope.checkboxes.isChecked(action.id));
        });

        let toRemove = ctrl.actions.filter(function (action) {
            return action._type ===
                MaintenanceService.MAINTENANCE_ACTION_TYPE.PLANNED &&
                (!$scope.checkboxes.isChecked(action.id));
        });

        return ctrl.params.save(toAdd, toRemove).then(function () {
            $scope.edit = false;
            if ($scope.onSave) {
                return $scope.onSave();
            }
        });
    }

    if (ctrl.params.loader) {
        ctrl.save = ctrl.params.loader.bind(save);
    } else {
        ctrl.save = ctrl.loader.bind(save);
    }

    ctrl.cancel = function () {
        $scope.edit = false;
        if ($scope.onCancel) {
            return $scope.onCancel();
        }
    };
}

componentsModule.controller('MaintenanceTableCtrl', MaintenanceTable);
