'use strict';

const componentsModule = require('../../../');
const mapValues = require('lodash/mapValues');

function getPercentage(count, total) {
    return 100 * (count / total);
}

/**
 * @ngInject
 */
function vulnerabilitiesWidgetCtrl($scope,
                                   $q,
                                   System,
                                   Utils,
                                   Stats) {

    $scope.loader = new Utils.Loader(false);
    $scope.percentages = {};
    $scope.total = 0;

    const getData = $scope.loader.bind(() => {
        return Stats.getErrata().then(res => {
            $scope.percentages =
                mapValues(res.data, count => getPercentage(count, res.data.total));
            $scope.total = res.data.total;
        });
    });

    getData();
    $scope.$on('group:change', getData);
}

function vulnerabilitiesWidget() {
    return {
        templateUrl:
        'js/components/overview/widgets/vulnerabilitiesWidget/vulnerabilitiesWidget.html',
        restrict: 'E',
        controller: vulnerabilitiesWidgetCtrl,
        replace: true,
        scope: {}
    };
}

componentsModule.directive('vulnerabilitiesWidget', vulnerabilitiesWidget);
