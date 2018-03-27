'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let accessMtuPoints = [];

accessMtuPoints.push(1235);
accessMtuPoints.push(1400);

for (let i = 0; i < 2; i++) {
    accessMtuPoints.push(1425);
}

for (let i = 0; i < 5; i++) {
    accessMtuPoints.push(1500);
}

for (let i = 0; i < 90; i++) {
    accessMtuPoints.push(1545);
}

const accessMtuTrace = {
    x: accessMtuPoints,
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

const data = [accessMtuTrace];

const layout = {
    autosize: true,
    title: 'Access Network MTU',
    xaxis: {
        title: 'MTU Size',
        range: [500, 2000]
    },
    yaxis: {
        title: 'Percentage',
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
            y0: -3,
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
function recommendationGraphCtrl($scope, $element) {
    const node = d3.select($element[0])
        .append('div')
        .style({
            width: '100%',
            height: '250px'
        })
        .node();

    Plotly.newPlot(node, data, layout, {displayModeBar: false});

    window.addEventListener('resize', function () {
        console.log('resizing access network mtu graph');
        Plotly.Plots.resize(node);
    });
}

function recommendationGraph() {
    return {
        templateUrl:
            'js/components/systemMetadata/recommendations/recommendationGraph.html',
        restrict: 'E',
        replace: true,
        controller: recommendationGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('recommendationGraph',  ['$window', recommendationGraph]);
