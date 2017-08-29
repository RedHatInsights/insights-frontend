'use strict';

const componentsModule = require('../../');
const findIndex = require('lodash/findIndex');
const orderBy = require('lodash/orderBy');

const DEFAULT_PAGE_SIZE = 8;

/**
 * @ngInject
 */
function planListCtrl($scope, $rootScope, Events, User, Utils) {
    User.asyncCurrent(function () {
        $scope.isInternal = User.current.is_internal;
    });

    function inherit (name) {
        $scope.$parent.$watch(name, function (value) {
            $scope[name] = value;
        });
    }

    inherit('edit');
    inherit('loadPlans');
    inherit('scrollToPlan');

    $scope.$watchCollection('plans', function () {
        $scope.pager.reset();
    });

    $rootScope.$on(Events.planner.openPlan, function (event, id) {
        // figure out which page the plan is on
        const plans =
            orderBy($scope.plans, ['start', 'maintenance_id'], ['desc', 'desc']);
        const index = findIndex(plans, plan => plan.maintenance_id.toString() === id);

        if (index === -1) {
            return; // not in this list
        }

        const page = Math.floor(index / $scope.pager.perPage) + 1;

        if (page !== $scope.pager.currentPage) {

            // scroll to the given page
            $scope.pager.currentPage = page;
            $scope.pager.update();
        }
    });

    $scope.pager = new Utils.Pager($scope.pageSize || DEFAULT_PAGE_SIZE);
}

function planList () {

    return {
        templateUrl: 'js/components/maintenance/planList/planList.html',
        restrict: 'E',
        controller: planListCtrl,
        replace: true,
        scope: {
            plans: '<',
            group: '<?',
            pageSize: '<?'
        }
    };
}

componentsModule.directive('planList', planList);
