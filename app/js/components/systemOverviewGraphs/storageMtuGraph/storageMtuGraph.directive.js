'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let storageMtuPoints = [];

for (let i = 0; i < 2; i++) {
    storageMtuPoints.push(1500);
}

for (let i = 0; i < 3; i++) {
    storageMtuPoints.push(1545);
}

for (let i = 0; i < 95; i++) {
    storageMtuPoints.push(9000);
}

const storageMtuTrace = {
    x: storageMtuPoints,
    name: 'MTU',
    type: 'histogram',
    autobinx: false,
    xbins: {
        start: 1,
        end: 12000,
        size: 400
    },
    marker: {
        color: 'rgba(39, 188, 255, 0.3)',
        line: {
            color: 'rgba(39, 188, 255, 0.7)',
            width: 1
        }
    }
};

const data = [storageMtuTrace];

const layout = {
    autosize: true,
    title: 'Storage Network MTU',
    xaxis: {
        title: 'MTU Size',
        range: [0, 12000]
    },
    yaxis: {
        title: '% of Total Systems',
        range: [0, 100]
    },
    margin: {
        l: 50,
        r: 30,
        b: 60,
        t: 60,
        pad: 4
    },
    shapes: [
        {
            type: 'line',
            x0: 9000,
            y0: -9,
            x1: 9000,
            y1: 103,
            line: {
                color: 'rgb(0, 150, 0, 1)',
                width: 2
            }
        }]
};

/**
 * @ngInject
 */
function storageMtuGraphCtrl($scope, $element) {
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

function storageMtuGraph() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/storageMtuGraph/storageMtuGraph.html',
        restrict: 'E',
        replace: true,
        controller: storageMtuGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('storageMtuGraph',  ['$window', storageMtuGraph]);
