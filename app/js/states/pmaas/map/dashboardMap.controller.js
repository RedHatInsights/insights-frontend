'use strict';

const statesModule = require('../../');
const d3 = require('d3');

// returns the angle in degrees between two points on the map
// used for the x tranlation for infinite scroll
// const getAngle = (p1, p2) => (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

function DashboardMapCtrl() {
    const div = window.jQuery('#map').get()[0];

    let width = div.scrollWidth;
    let height = div.scrollHeight;
    let rotate = 0;        // so that [-60, 0] becomes initial center of projection
    let maxlat = 79;       // clip northern and southern poles (infinite in mercator)

    let projection = d3.geo.mercator()
        .rotate([rotate, 0])
        .scale(1)
        .translate([width / 2, height / 2]);

    // set up the scale extent and initial scale for the projection
    let b = mercatorBounds(projection, maxlat);
    let s = width / (b[1][0] - b[0][0]);
    let scaleExtent = [s, 15 * s];

    // find the top left and bottom right of current projection
    function mercatorBounds(projection, maxlat) {
        let yaw = projection.rotate()[0];
        let xymax = projection([-yaw + 180 - 1e-6,-maxlat]);
        let xymin = projection([-yaw - 180 + 1e-6, maxlat]);

        return [xymin,xymax];
    }

    projection
        .scale(scaleExtent[0]);

    let zoom = d3.behavior.zoom()
        .scaleExtent(scaleExtent)
        .scale(projection.scale())
        .translate([0,0])               // not linked directly to projection
        .on('zoom', redraw);

    let path = d3.geo.path()
        .projection(projection);

    let svg = d3.select('.map')
        .append('svg')
            .attr('width', width)
            .attr('height', height)
            .call(zoom);

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
                const angle = (((360.0 * dx) / width) * scaleExtent[0]) / scale;
                console.log((((360.0 * dx) / width) * scaleExtent[0]) / scale);

                // use x translation to rotate based on current scale
                projection.rotate([yaw + angle, 0, 0]);

                // use y translation to translate projection, clamped by min/max
                let b = mercatorBounds(projection, maxlat);

                if (b[0][1] + dy > 0) {
                    dy = -b[0][1];
                } else if (b[1][1] + dy < height) {
                    dy = height - b[1][1];
                }

                projection.translate([tp[0], tp[1] + dy]);
            }

            // save last values.  resetting zoom.translate() and scale() would
            // seem equivalent but doesn't seem to work reliably?
            slast = scale;
            tlast = t;
        }

        svg.selectAll('path')
            .attr('d', path);
    }

    window.addEventListener('keypress', () => {
        // console.log(projection.scale());
        // console.log(projection.translate());
    });
}

statesModule.controller('DashboardMapCtrl', DashboardMapCtrl);
