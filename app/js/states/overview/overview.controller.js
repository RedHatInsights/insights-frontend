'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function OverviewCtrl(
    $scope,
    User,
    $modal,
    TrialSku,
    MaintenanceService,
    $rootScope,
    Stats) {

    $scope.stats = {};

    User.asyncCurrent(function (user) {
        $scope.paid = function () {
            let ents = user.current_entitlements;
            let isPaid = false;

            if (ents) {

                if (ents.whitelist && (ents.whitelist.rhel || ents.whitelist.osp)) {
                    isPaid = true;
                }

                else if (ents.unlimitedRHEL) {
                    isPaid = true;
                }

                // Return true if the user has any SKU that is not the Trial SKU
                else if (Array.isArray(ents.skus) && ents.skus.find(
                    function (sku) {
                        return sku.skuName !== TrialSku;
                    }) !== undefined) {

                    isPaid = true;
                }
            }

            return isPaid;
        };
    });

    $scope.edit = function () {
        $modal.open({
            templateUrl: 'js/components/overview/articleModal/articleModal.html',
            windowClass: 'handcrafted-content-modal ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'ArticleModalCtrl'
        });
    };

    function loadPlans(force) {
        MaintenanceService.plans.load(force);
    }

    loadPlans(false);

    $rootScope.$on('reload:data', function () {
        loadPlans(true);
    });

    Stats.getRules({include: 'ansible'}, true).then(function (res) {
        $scope.stats.rules = res.data;
    });
}

statesModule.controller('OverviewCtrl', OverviewCtrl);
