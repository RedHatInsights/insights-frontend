'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let tenantMtuPoints = [];

for (let i = 0; i < 40; i++) {
    tenantMtuPoints.push(1500);
}

for (let i = 0; i < 3; i++) {
    tenantMtuPoints.push(2500);
}

for (let i = 0; i < 7; i++) {
    tenantMtuPoints.push(4500);
}

for (let i = 0; i < 40; i++) {
    tenantMtuPoints.push(9000);
}

const tenantMtuTrace = {
    x: tenantMtuPoints,
    name: 'Tenant MTU',
    type: 'histogram',
    autobinx: false,
    xbins: {
        start: 1,
        end: 12000,
        size: 400
    },
    marker: {
        color: 'rgba(39, 188, 255, 0.4)',
        line: {
            color: 'rgba(39, 188, 255, 0.4)',
            width: 1
        }
    }
};

const tenantMtuData = [tenantMtuTrace];

const mtuLayout = {
    autosize: false,
    width: 260,
    height: 240,
    title: 'Network Tenant MTU',
    xaxis: {
        title: 'MTU Size',
        range: [0, 12000]
    },
    yaxis: {
        title: 'Percentage'
    },
    margin: {
        l: 50,
        r: 30,
        b: 50,
        t: 60,
        pad: 4
    },
    shapes: [
        {
            type: 'line',
            x0: 800,
            y0: -3,
            x1: 800,
            y1: 45,
            line: {
                color: 'rgb(200, 0, 0, 1)',
                width: 2
            }
        }]
};

/**
 * @ngInject
 */
function tenantMtuGraphCtrl($scope, $element) {
    const tenantMtuNode = d3.select($element[0]).append('div').node();

    Plotly.newPlot(tenantMtuNode, tenantMtuData, mtuLayout, {displayModeBar: false});
}

function tenantMtuGraph() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/tenantMtuGraph/tenantMtuGraph.html',
        restrict: 'E',
        replace: true,
        controller: tenantMtuGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('tenantMtuGraph', tenantMtuGraph);
