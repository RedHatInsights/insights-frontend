'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

var data = [{
    values: [93, 7],
    labels: ['Present (standard configurations)', 'Not Present (includes your system)'],
    type: 'pie',
    marker: {
        colors: ['#ededed', '#0088ce'],
        line: {
            color: '#FFF',
            width: 1
        }
    },
    textfont: {
        family: 'overpass, helvetica',
        color: '#FFF',
        size: 16
    }
}];

var layout = {
    height: 450,
    width: 350,
    legend: {
        x: 0.10,
        y: -0.25
    },
    margin: {
        l: 0,
        r: 0,
        b: 50,
        t: 50
    },
    font: {
        family: 'overpass, helvetica',
        size: 14
    },
    annotations: [
        {
            x: 0.45,
            y: 0.75,
            text: 'Your System',
            showarrow: true,
            arrowhead: 7,
            ax: -60,
            ay: 0
        },
        {
            x: 0.5,
            y: 0.40,
            text: 'Standard Configuration',
            showarrow: false
        }
    ]
};

/**
 * @ngInject
 */
function recommendationGraphCtrl($scope, $element) {
    const node = d3.select($element[0]).select('.recommendation-graph')
        .append('div')
        .style({
            width: '350px',
            height: '450px'
        })
        .node();

    window.addEventListener('resize', function () {
        let e = window.getComputedStyle(node).display;
        if (e && e !== 'none') {
            Plotly.Plots.resize(node);
        }
    });

    Plotly.newPlot(node, data, layout, {displayModeBar: false});
}

function recommendationGraph() {
    return {
        templateUrl:
            'js/components/systemMetadata/recommendations/recommendationGraph.html',
        restrict: 'E',
        replace: true,
        controller: recommendationGraphCtrl,
        scope: {
            recommendation: '='
        }
    };
}

componentsModule.directive('recommendationGraph', ['$window', recommendationGraph]);
