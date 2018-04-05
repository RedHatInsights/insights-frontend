/*global require*/
'use strict';

const componentsModule = require('../');
const keyBy = require('lodash/keyBy');
const demoData = require('../../demoData');
const c3 = require('c3');
const d3 = require('d3');
const donutSize = 55;
const donutThickness = 5;

const donutVals     = {
    size: {
        width: donutSize,
        height: donutSize
    },
    donut: { width: donutThickness },
    data: { type: 'donut' },
    legend: { show: false }
};

function donutSettings(obj) {
    return Object.assign({}, donutVals, obj);
}

function generateCharts(chartData) {
    for (const data of chartData) {
        c3.generate(donutSettings({
            bindto: `.chart-${data.name}`,
            data: {
                columns: data.columns,
                type: 'donut',
                labels: false
            },
            donut: {
                title: data.title,
                width: donutThickness
            },
            color: data.color
        }));
    }
}

/**
 * @ngInject
 */
function inventoryHeaderCtrl($scope, gettextCatalog) {

    function init() {
        $scope.nameTranslated = gettextCatalog.getString($scope.name);
        $scope.regionTranslated = gettextCatalog.getString($scope.region);
        $scope.typeTranslated = gettextCatalog.getString($scope.type);
    }

    let chartData = demoData.getDemoDeploymentDonutChartData();
    $scope.charts = keyBy(chartData, 'name');
    generateCharts(chartData);

    d3.select('.container')
        .insert('div', '.chart')
        .attr('class', 'legend')
        .selectAll('span')
        .data(['data1', 'data2', 'data3'])
        .enter().append('span')
        .attr('data-id', function (id) { return id; })
        .html(function (id) { return id; });

    init();
}

function inventoryHeader() {
    return {
        transclude: true,
        templateUrl: 'js/components/inventoryHeader/inventoryHeader.html',
        restrict: 'E',
        replace: true,
        controller: inventoryHeaderCtrl,
        scope: {
            name: '@',
            region: '@',
            type: '@'
        }
    };
}

componentsModule.directive('inventoryHeader', inventoryHeader);
