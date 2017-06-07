'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function totalRiskSelectCtrl($location,
                             $rootScope,
                             $scope,
                             gettextCatalog,
                             Events,
                             Severities) {
    $scope.options = Severities;
    $scope.label = 'All';

    $scope.select = function (option) {
        $scope.selected = option;
        $scope.label = option.label;
        $location.search()[Events.filters.totalRisk] = $scope.selected.value;

        // If 'All' is selected there is no reason to store the filter
        if ($scope.selected.value === 'All') {
            delete $location.search()[Events.filters.totalRisk];
        }

        $rootScope.$broadcast(Events.filters.totalRisk);
    };

    function read() {
        $scope.selected = find($scope.options, (option) => {
            return option.value === $location.search()[Events.filters.totalRisk];
        });

        $scope.selected = $scope.selected ? $scope.selected :
            find($scope.options, (option) => {
                return option.value === 'All';
            });

        $scope.label = $scope.selected.label;
    }

    $scope.$on(Events.filters.totalRisk, function () {
        read();
    });

    read();

    $scope.$on(Events.filters.reset, function () {
        $scope.selected = find($scope.options, (option) => {
            return option.value === 'All';
        });

        $scope.label = $scope.selected.label;
    });
}

function totalRiskSelect() {
    return {
        templateUrl:
            'js/components/filterComponents/totalRiskSelect/totalRiskSelect.html',
        restrict: 'E',
        controller: totalRiskSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('totalRiskSelect', totalRiskSelect);
