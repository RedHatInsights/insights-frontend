'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let tenantMtuPoints = [];

tenantMtuPoints.push(1235);
tenantMtuPoints.push(1400);

for (let i = 0; i < 2; i++) {
    tenantMtuPoints.push(1425);
}

for (let i = 0; i < 5; i++) {
    tenantMtuPoints.push(1500);
}

for (let i = 0; i < 90; i++) {
    tenantMtuPoints.push(1545);
}

const tenantMtuTrace = {
    x: tenantMtuPoints,
    name: 'MTU',
    type: 'histogram',
    autobinx: false,
    xbins: {
        start: 0,
        end: 2000,
        size: 50
    },
    marker: {
        color: 'rgba(39, 188, 255, 0.4)',
        line: {
            color: 'rgba(39, 188, 255, 0.4)',
            width: 1
        }
    }
};

const data = [tenantMtuTrace];

const layout = {
    autosize: true,
    title: 'Access Network MTU',
    xaxis: {
        title: 'MTU Size',
        range: [500, 2000]
    },
    yaxis: {
        title: '% of Total Systems',
        range: [0, 100]

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
            x0: 950,
            y0: -20,
            x1: 950,
            y1: 103,
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
    const node = d3.select($element[0])
        .append('div')
        .style({
            width: '100%',
            height: '250px'
        })
        .node();

    Plotly.newPlot(node, data, layout, {displayModeBar: false});

    window.addEventListener('resize', function () {
        let e = window.getComputedStyle(node).display;
        if (e && e !== 'none') {
            Plotly.Plots.resize(node);
        }
    });
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

componentsModule.directive('tenantMtuGraph',  ['$window', tenantMtuGraph]);
