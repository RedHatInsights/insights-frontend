'use strict';

var componentsModule = require('../../../../');
var c3 = require('c3');
var priv = {};

priv.putGaugeOnPage = function (element, number, max) {
    return c3.generate({
        bindto: element[0].getElementsByClassName('chart-wrapper')[0],
        size: {
            height: 80,
            width: 80
        },
        gauge: {
            width: 10,
            max: max,
            expand: true,
            label: {
                format: function (value) {
                    return (value + '/' + max);
                },

                show: false
            },
            fullCircle: true,
            startingAngle: -Math.PI / 2
        },
        data: {
            columns: [
                ['systems', number]
            ],
            type: 'gauge'
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#0095DB'],
            threshold: {
                values: [max / 4, max * 2 / 4, max * 3 / 4, max]
            }
        }
    });
};

priv.updateScope = function ($scope, num, max) {
    $scope.gaugeNumber = num;
    $scope.gaugeMax = max;
};

/**
 * @ngInject
 */
function generateChartCtrl($scope, $element) {
    $scope.buildGauge = function (options) {
        // init
        options.getGaugeNumber().then(function (data) {
            $scope.goalsGauge =
                priv.putGaugeOnPage($element, data, options.getGaugeMax());
            priv.updateScope($scope, data, options.getGaugeMax());
        });

        // when the account changes
        $scope.$on('account:change', function () {
            $scope.gaugeMax = options.getGaugeMax();
            options.getGaugeNumber().then(function (data) {
                $scope.goalsGauge.load({
                    columns: [['systems', data]]
                });
                priv.updateScope($scope, data, options.getGaugeMax());
            });
        });
    };
}

/**
 * @ngInject
 */
function goalsGauge() {
    return {
        templateUrl: 'js/components/overview/widgets/goals/goalsGauge/goalsGauge.html',
        restrict: 'E',
        replace: false,
        scope: true,
        controller: generateChartCtrl
    };
}

componentsModule.directive('goalsGauge', goalsGauge);
