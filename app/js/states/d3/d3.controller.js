'use strict';

const statesModule = require('../');
const Datamaps = require('datamaps');
const topojson = require('topojson');
const d3 = require('d3');
const $ = require('jquery');
const world = require("../../../../node_modules/world-atlas/world/110m.json");

// returns the angle in degrees between two points on the map
// used for the x tranlation for infinite scroll
const getAngle = (p1, p2) => (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

function D3Ctrl() {
    const div = $('#d3').get()[0];
    // const dm = new Datamaps({
    //     scope: 'world',
    //     element: div,
    //     projection: 'mercator',
    //     responsive: true
    // });

    // d3.select(window).on("resize", dm.resize);

    // dm.path = d3.geo.path().projection(dm.projection);
    // dm.paths = dm.svg.selectAll("path");
    // dm.dm_subunits = dm.svg.selectAll(".datamaps-subunit");
    // dm.paths.style("vector-effect", "non-scaling-stroke");

    var width = div.scrollWidth,
        height = div.scrollHeight,
        rotate = 0,        // so that [-60, 0] becomes initial center of projection
        maxlat = 79;        // clip northern and southern poles (infinite in mercator)

    var projection = d3.geo.mercator()
        .rotate([rotate, 0])
        .scale(1)           // we'll scale up to match viewport shortly.
        .translate([width / 2, height / 2]);

    // find the top left and bottom right of current projection
    function mercatorBounds(projection, maxlat) {
        var yaw = projection.rotate()[0],
            xymax = projection([-yaw+180-1e-6,-maxlat]),
            xymin = projection([-yaw-180+1e-6, maxlat]);

        return [xymin,xymax];
    }

    // set up the scale extent and initial scale for the projection
    var b = mercatorBounds(projection, maxlat),
        s = width/(b[1][0]-b[0][0]),
        scaleExtent = [s, 15*s];

    projection
        .scale(scaleExtent[0]);

    var zoom = d3.behavior.zoom()
        .scaleExtent(scaleExtent)
        .scale(projection.scale())
        .translate([0,0])               // not linked directly to projection
        .on("zoom", redraw);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.selectAll('.d3')
        .append('svg')
            .attr('width', width)
            .attr('height', height)
            .call(zoom);

    svg.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append('path')

    redraw();

    // track last translation and scale event we processed
    let tlast = [0,0],
        slast = null,
        angle = null;

    function redraw() {
        if (d3.event) {
            const coords = d3.mouse(this);
            var scale = d3.event.scale,
                t = d3.event.translate;

            let dx = t[0] - tlast[0],
                dy = t[1] - tlast[1],
                yaw = projection.rotate()[0],
                tp = projection.translate();

            // if scaling changes, ignore translation (otherwise touch zooms are weird)
            if (scale != slast) {
                projection.scale(scale);
                projection.translate(tp);
            } else {
                console.log((((360.0 * dx) / width) * scaleExtent[0]) / scale);
                // use x translation to rotate based on current scale
                projection.rotate([yaw + (((360.0 * dx) / width) * scaleExtent[0]) / scale, 0, 0]);
                // use y translation to translate projection, clamped by min/max
                let b = mercatorBounds(projection, maxlat);
                if (b[0][1] + dy > 0) dy = -b[0][1];
                else if (b[1][1] + dy < height) dy = height - b[1][1];
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

statesModule.controller('D3Ctrl', D3Ctrl);
