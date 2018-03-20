/*global require*/
'use strict';

const statesModule = require('../../');
const d3 = require('d3');
const topojson = require('topojson');
const world = require('../../../../../node_modules/world-atlas/world/110m.json');
const priv = {};

// returns the angle in degrees between two points on the map
// used for the x tranlation for infinite scroll
// const getAngle = (p1, p2) => (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

priv.mercatorBounds = (projection, maxlat) => {
    // find the top left and bottom right of current projection
    const yaw = projection.rotate()[0];
    const xymax = projection([-yaw + 180 - 1e-6,-maxlat]);
    const xymin = projection([-yaw - 180 + 1e-6, maxlat]);
    return [xymin, xymax];
};

priv.getConf = () => {
    const div = document.querySelector('#map');
    const ret = {
        width: div.scrollWidth,
        height: div.scrollHeight,
        rotate: 0,
        maxLatitude: 79
    };

    console.log(`getConf: ${JSON.stringify(ret, false, 2)}`);
    return ret;
};

priv.getScale = (projection, maxLatitude, width) => {
    // set up the scale extent and initial scale for the projection
    const bounds = priv.mercatorBounds(projection, maxLatitude);
    const scale  = width / (bounds[1][0] - bounds[0][0]);
    return [scale, 15 * scale];
};

function DashboardMapCtrl() {
    let conf = priv.getConf();

    window.priv = priv;

    window.addEventListener('keypress', () => {
        // console.log(projection.scale());
        // console.log(projection.translate());
    });

    let projection = d3.geo.mercator()
        .rotate([conf.rotate, 0])
        .scale(1)
        .translate([conf.width / 2, conf.height / 2]);

    let scaleExtent = priv.getScale(projection, conf.maxLatitude, conf.width);

    projection.scale(scaleExtent[0]);

    let zoom = d3.behavior.zoom()
        .scaleExtent(scaleExtent)
        .scale(projection.scale())
        .translate([0, 0]) // not linked directly to projection
        .on('zoom', redraw);

    let path = d3.geo.path()
        .projection(projection);

    let svg = d3.select('.map')
        .append('svg')
        .attr('width', conf.width)
        .attr('height', conf.height)
        .call(zoom);

    svg.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append('path');

    // track last translation and scale event we processed
    let tlast = [0,0];
    let slast = null;

    function redraw() {
        if (d3.event) {
            let scale = d3.event.scale;
            let t = d3.event.translate;

            let dx = t[0] - tlast[0];
            let dy = t[1] - tlast[1];
            let yaw = projection.rotate()[0];
            let tp = projection.translate();

            // if scaling changes, ignore translation (otherwise touch zooms are weird)
            if (scale !== slast) {
                projection.scale(scale);
                projection.translate(tp);
            } else {
                const angle = (((360.0 * dx) / conf.width) * scaleExtent[0]) / scale;

                // use x translation to rotate based on current scale
                projection.rotate([yaw + angle, 0, 0]);

                // use y translation to translate projection, clamped by min/max
                let b = priv.mercatorBounds(projection, conf.maxlat);

                if (b[0][1] + dy > 0) {
                    dy = -b[0][1];
                } else if (b[1][1] + dy < conf.height) {
                    dy = conf.height - b[1][1];
                }

                projection.translate([tp[0], tp[1] + dy]);
            }

            // save last values.  resetting zoom.translate() and scale() would
            // seem equivalent but doesn't seem to work reliably?
            slast = scale;
            tlast = t;
        }

        svg.selectAll('path').attr('d', path);
    }

    window.onresize = () => {
        conf = priv.getConf();
        svg.attr('width', conf.width);
        svg.attr('height', conf.height);
        redraw();
    };

    redraw();
}

statesModule.controller('DashboardMapCtrl', DashboardMapCtrl);
