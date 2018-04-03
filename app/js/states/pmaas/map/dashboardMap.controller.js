/*global require*/
'use strict';

const statesModule = require('../../');
const keyBy = require('lodash/keyBy');
const d3 = require('d3');
const topojson = require('topojson');
const world = require('./dashboardMap.json');
const c3 = require('c3');
const donutSize = 50;
const donutThickness = 4;

const priv = {
    tlast: [0, 0],
    slast: null,
    pins: [],
    lastScale: 1,
    transitionTime: 200
};

const deployment_types = {
    all: 'all',
    privateCloud: 'privc',
    publicCloud: 'pubc',
    virtual: 'virtual',
    physical: 'physical'
};

const donutVals = {
    size: {
        width: donutSize,
        height: donutSize
    },
    donut: { width: donutThickness },
    data: { type: 'donut' },
    legend: { show: false }
};

const pinConfig = {
    height: 40,
    width: 40,
    offsetx: 20,
    offsety: 40
};

const pinLocations = {
    USA: {
        issues: true,
        offset: [30, -30],
        coordinates: [{
            name: 'San Francisco',
            array: [-122.490402, 37.786453],
            type: deployment_types.privateCloud,
            issues: true,
            deployment_id: 'azure-europe',
            title: 'San Francisco On-Stage',
            subtitle: 'Private Cloud | OpenStack & OpenShift'
        }, {
            name: 'virgina',
            type: deployment_types.publicCloud,
            array: [-78.024902, 37.926868],
            issues: false,
            deployment_id: 'aws-east',
            title: 'US East Cloud',
            subtitle: 'aws US-East-2 | OpenShift'
        }]
    },
    CAN: {
        issues: false,
        offset: [-50, -190],
        coordinates: []
    },
    DEU: {
        issues: false,
        offset: [25, 45],
        coordinates: [{
            name: 'germany',
            array: [10, 52.520008],
            type: deployment_types.publicCloud,
            issues: false,
            deployment_id: 'priv-openstack',
            title: 'Germany Cloud',
            subtitle: 'Azure West Europe | OpenShift'
        }]
    }
};

function donutSettings(obj) {
    return Object.assign({}, donutVals, obj);
}

const charts = [
    {
        name: 'vulnerability',
        columns: [
            ['Secure systems', 982],
            ['Vulnerable systems', 218]
        ],
        title: '82%',
        color: {
            pattern: [
                '#f0ab00',
                '#d1d1d1'
            ]
        }
    },

    {
        name: 'compliance',
        columns: [
            ['Compliant systems', 816],
            ['Noncompliant systems', 384]
        ],
        title: '68%',
        color: {
            pattern: [
                '#cc0000',
                '#d1d1d1'
            ]
        }
    },

    {
        name: 'advisor',
        columns: [
            ['Rules evaluated', 90],
            ['Rules passed', 65]
        ],
        title: '58%',
        color: {
            pattern: [
                '#cc0000',
                '#d1d1d1'
            ]
        }
    },

    {
        name: 'subscription',
        columns: [
            ['RHEL', 1050],
            ['OpenShift', 100],
            ['OpenStack', 50],
            ['Available', 25]
        ],
        title: '98%',
        color: {
            pattern: [
                '#004368',
                '#0088ce',
                '#7dc3e8',
                '#d1d1d1'
            ]
        }
    }
];

// returns the angle in degrees between two points on the map
// used for the x tranlation for infinite scroll
// const getAngle = (p1, p2) => (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

priv.getCoords = d => {
    // used to switch from DOM coordingates into SVG
    // coordinates.
    const svg = priv.svg[0][0];
    const pt = svg.createSVGPoint();

    pt.x = priv.projection(d.array)[0];
    pt.y = priv.projection(d.array)[1];

    return pt.matrixTransform(svg.getCTM().inverse());
};

priv.mercatorBounds = (projection, maxlat) => {
    // find the top left and bottom right of current projection
    const yaw = projection.rotate()[0];
    const xymax = projection([-yaw + 180 - 1e-6,-maxlat]);
    const xymin = projection([-yaw - 180 + 1e-6, maxlat]);
    xymin[1] += 400;
    xymax[1] -= 600;
    return [xymin, xymax];
};

priv.getConf = () => {
    const div = document.querySelector('#map');
    const ret = {
        width: window.innerWidth,
        height: div.offsetHeight,
        rotate: 0,
        maxLatitude: 86
    };

    return ret;
};

priv.getScale = (projection, maxLatitude, width) => {
    // set up the scale extent and initial scale for the projection
    const bounds = priv.mercatorBounds(priv.projection, maxLatitude);
    const scale  = width / (bounds[1][0] - bounds[0][0]);
    return [1.1 * scale, 4 * scale];
};

priv.reInit = (conf) => {
    priv.scaleExtent = priv.getScale(priv.projection, conf.maxLatitude, conf.width);
    priv.slast = priv.projection.scale();
    priv.tlast = priv.projection.translate();

    priv.zoom
        .scale(priv.projection.scale())
        .translate(priv.projection.translate());

    priv.svg
        .attr('width', conf.width)
        .attr('height', conf.height);

    priv.updatePins();
    priv.redraw();
};

priv.init = (conf, $scope, $state, $timeout) => {
    priv.projection = d3.geo.mercator()
        .rotate([conf.rotate, 0])
        .scale(1)
        .translate([conf.width / 2, (conf.height / 2) + 150]);

    priv.scaleExtent = priv.getScale(priv.projection, conf.maxLatitude, conf.width);
    priv.projection.scale(priv.scaleExtent[0]);
    priv.slast = priv.scaleExtent[0];

    priv.zoom = d3.behavior.zoom()
        .scaleExtent(priv.scaleExtent)
        .scale(priv.projection.scale())
        .translate([0, 0]) // not linked directly to projection
        .on('zoom', priv.redraw);

    priv.path = d3.geo.path()
        .projection(priv.projection);

    priv.svg = d3.select('.map')
        .append('svg')
        .style('display', 'block')
        .attr('width', conf.width)
        .attr('height', conf.height)
        .call(priv.zoom);

    priv.popover = d3.select('#popover')
        .attr('id', 'popover')
        .style('display', 'none');

    priv.centroids = priv.svg.append('g')
        .attr('class', 'centroid');

    priv.svg.selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append('path')
        .attr('d', d => {
            if (pinLocations[d.id] && pinLocations[d.id].coordinates) {
                const data = [];
                const pin = priv.centroids.selectAll('svg')
                    .data(pinLocations[d.id].coordinates)
                    .enter()
                    .append('svg:image')
                    .style('stroke-width', 100)
                    .style('stroke-opacity', 0)
                    .style('stroke', '#ff0')
                    .style('z-index', 1000)
                    .style('cursor', 'pointer')
                    .attr('width', () => pinConfig.width)
                    .attr('height', () => pinConfig.height)
                    .attr('d', d => data.push(d))
                    .attr('x', d => priv.projection(d.array)[0] - pinConfig.offsetx)
                    .attr('y', d => priv.projection(d.array)[1] - pinConfig.offsety)
                    .attr('xlink:href', d => {
                        if (d.issues) {
                            return 'static/images/i_pin-has-error.svg';
                        } else {
                            return 'static/images/i_pin-good.svg';
                        }
                    })
                    .style('display', 'inline')
                    .on('click', d => {
                        const params = {deployment_id: d.deployment_id};
                        $state.go('app.dashboard-deployment', params);
                    })
                    .on('mouseenter', d => {
                        $scope.popover = {
                            title: d.title,
                            subtitle: d.subtitle,
                            issues: d.issues
                        };
                        $scope.$apply();

                        const svgCoord = priv.getCoords(d);
                        const pos = `left:${svgCoord.x}px;top:${svgCoord.y - 100}px`;

                        priv.selectedPin = d;

                        priv.popover.attr('style', pos)
                            .style('display', 'none')
                            .style('position', 'absolute')
                            .style('color', '#222')
                            .style('background', '#fff')
                            .style('border-radius', '3px');

                        $timeout(() => {
                            priv.popover.style('display', 'inline');
                        }, 1000);
                    });

                if (data.length > 0) {
                    pin[0].forEach((p, i) => {
                        priv.pins.push({
                            parent: d,
                            drawable: d3.select(p),
                            data: data[i]
                        });
                    });
                }
            }
        });

    priv.redraw();
};

priv.redraw = () => {
    if (d3.event) {
        const scale = d3.event.scale;
        const t = d3.event.translate;
        const conf = priv.getConf();

        if (scale !== priv.slast) {
            priv.projection.scale(scale);
        } else {
            let dx = t[0] - priv.tlast[0];
            let dy = t[1] - priv.tlast[1];
            let yaw = priv.projection.rotate()[0];
            let tp = priv.projection.translate();

            const angle = 360.0 * dx / conf.width * priv.scaleExtent[0] / scale;

            // use x translation to rotate based on current scale
            priv.projection.rotate([yaw + angle, 0, 0]);

            // use y translation to translate projection, clamped by min/max
            const b = priv.mercatorBounds(priv.projection, conf.maxLatitude);

            if (b[0][1] + dy > 0) {
                dy = 0;
            } else if (b[1][1] + dy < conf.height) {
                dy = 0;
            }

            priv.projection.translate([tp[0], tp[1] + dy]);
        }

        priv.slast = scale;
        priv.tlast = t;
        priv.popover.style('display', 'none');
        priv.updatePins();
    }

    priv.svg.selectAll('path').attr('d', priv.path);
};

priv.updatePins = (transition) => {
    priv.pins.forEach(p => {
        if (transition) {
            p.drawable.transition()
                .duration(priv.transitionTime)
                .attr('x', d => priv.projection(d.array)[0] - pinConfig.offsetx)
                .attr('y', d => priv.projection(d.array)[1] - pinConfig.offsety);
        } else {
            p.drawable
                .attr('x', d => priv.projection(d.array)[0] - pinConfig.offsetx)
                .attr('y', d => priv.projection(d.array)[1] - pinConfig.offsety);
        }
    });
};

function generateCharts(chartData, popover) {
    for (const data of chartData) {
        const bindto = popover ? `.chart-${data.name}-popover` :
            `.chart-${data.name}`;

        c3.generate(donutSettings({
            bindto: bindto,
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

function DashboardMapCtrl($timeout, $scope, $state) {
    window.priv = priv;
    $scope.popover = {};
    $scope.selectedDeployments = [];
    $scope.selectedPinType = deployment_types.all;
    $scope.deployment_types = deployment_types;

    $scope.$watch('navCollapsed', (n, o) => {
        if (n !== o) {
            $timeout(() => priv.reInit(priv.getConf()), 200);
        }
    });

    $scope.closePopover = () => {
        priv.popover.style('display', 'none');
        priv.selectedPin = null;
    };

    $scope.zoom = zoomIn => {
        if ((priv.projection.scale() === priv.scaleExtent[1] && zoomIn) ||
            (priv.projection.scale() === priv.scaleExtent[0]) && !zoomIn) {
            return;
        }

        priv.lastScale = zoomIn ? priv.lastScale + 1 : priv.lastScale - 1;

        const scale = priv.lastScale * priv.scaleExtent[0];

        priv.slast = scale;
        priv.popover.style('display', 'none');
        priv.projection.scale(scale);
        priv.zoom.scale(scale);
        priv.updatePins(true);
        priv.svg.selectAll('path')
            .transition()
            .duration(priv.transitionTime)
            .attr('d', priv.path);
    };

    $scope.filterPins = filter => {
        $scope.selectedPinType = filter;
        priv.popover.style('display', 'none');
        priv.pins.forEach(p => {
            if (p.data.type === filter ||
                filter === deployment_types.all) {
                $scope.selectedDeployments.push(p.data);
                p.drawable.style('display', 'inline');
            } else {
                p.drawable.style('display', 'none');
            }
        });
    };

    $timeout(() => {
        priv.init(priv.getConf(), $scope, $state, $timeout);
        $scope.filterPins(deployment_types.all);
        generateCharts(charts, true);

        d3.select('.chart-vulnerability-popover')
        .select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Secure');

        d3.select('.chart-compliance-popover')
            .select('.c3-chart-arcs-title')
            .append('tspan')
            .attr('dy', 25)
            .attr('x', 0)
            .text('Compliant');

        d3.select('.chart-advisor-popover')
            .select('.c3-chart-arcs-title')
            .append('tspan')
            .attr('dy', 25)
            .attr('x', 0)
            .text('Optimized');

        d3.select('.chart-subscription-popover')
            .select('.c3-chart-arcs-title')
            .append('tspan')
            .attr('dy', 25)
            .attr('x', 0)
            .text('Utilized');
    }, 1500);

    window.onresize = () => $timeout(() => priv.reInit(priv.getConf()), 200);

    $scope.charts = keyBy(charts, 'name');
    generateCharts(charts);

    d3.select('.chart-vulnerability').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Secure');

    d3.select('.chart-compliance').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Compliant');

    d3.select('.chart-advisor').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Optimized');

    d3.select('.chart-subscription').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Utilized');

    d3.select('.container')
        .insert('div', '.chart')
        .attr('class', 'legend')
        .selectAll('span')
        .data(['data1', 'data2', 'data3'])
        .enter().append('span')
        .attr('data-id', function (id) { return id; })
        .html(function (id) { return id; });
}

statesModule.controller('DashboardMapCtrl', DashboardMapCtrl);
