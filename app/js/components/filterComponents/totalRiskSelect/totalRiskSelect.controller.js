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

    $scope.select = function (option) {
        $scope.selected = option;
        $location.search().totalRisk = $scope.selected.value;
        $rootScope.$broadcast(Events.topicFilters.totalRisk);
    };

    function read() {
        $scope.selected = find($scope.options, (option) => {
            return option.value === $location.search().totalRisk ?
                $location.search().totalRisk : 'All';
        });
    }

    read();

    $scope.$on(Events.topicFilters.reset, function () {
        $scope.selected = find($scope.options, (option) => {
            return option.id === 'All';
        });
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
