'use strict';

const statesModule = require('../');
const Datamaps = require('datamaps');
const d3 = require('d3');
const $ = require('jquery');

let lastx, lasty;
let dm;

function Zoom(args) {
  $.extend(this, {
    scale:      { max: 50, currentShift: 0 },
    $container: args.$container,
    datamap:    args.datamap
  });
}

Zoom.prototype.init = function() {
    console.log(dm);
    var paths = this.datamap.svg.selectAll("path"),
        subunits = this.datamap.svg.selectAll(".datamaps-subunit");

    // preserve stroke thickness
    paths.style("vector-effect", "non-scaling-stroke");

    subunits.call(
        d3.behavior.drag().on("dragstart", function() {
            d3.event.sourceEvent.stopPropagation();
        })
    );

    const drag = d3.behavior.drag()
        .on('dragstart', function () {
            const sourceEvent = d3.event.sourceEvent;
            lastx = sourceEvent.x;
            lasty = sourceEvent.y;
        })
        .on('drag', () => {
            const sourceEvent = d3.event.sourceEvent;
            const currentTrans = dm.projection.translate();
            const dx = sourceEvent.x - lastx;
            const dy = sourceEvent.y - lasty;

            dm.projection.translate([
                currentTrans[0] + dx,
                currentTrans[1] + dy
            ]);

            dm.svg.selectAll("path")
                .attr('d', dm.path);

            lastx = sourceEvent.x;
            lasty = sourceEvent.y;
        });

    subunits.call(drag);
    dm.svg.call(drag);

    this.scale.set = this._getScalesArray();
    this.d3Zoom = d3.behavior.zoom().scaleExtent([ 1, this.scale.max ]);
  // console.log(d3.behavior);
  // // map drag capability
  // d3.behavior.drag().on('drag', function() {
  //   var dx = d3.event.dx;
  //   var dy = d3.event.dy;

  //   console.log('being dragged');
  // })

      this._displayPercentage(1);
      this.listen();
};

Zoom.prototype.listen = function() {
    //this.$buttons.off("click").on("click", this._handleClick.bind(this));

    this.datamap.svg
        .call(this.d3Zoom.on("zoom", this._handleScroll.bind(this)))
        .on("dblclick.zoom", null); // disable zoom on double-click
};

Zoom.prototype.reset = function() {
    this._shift("reset");
};

Zoom.prototype._handleScroll = function() {
    var translate = d3.event.translate,
        scale = d3.event.scale,
        limited = this._bound(translate, scale);

    this.scrolled = true;

    this._update(limited.translate, limited.scale);
};

Zoom.prototype._handleClick = function(event) {
    var direction = $(event.target).data("zoom");

    this._shift(direction);
};

Zoom.prototype._shift = function(direction) {
    var center = [ this.$container.width() / 2, this.$container.height() / 2 ],
        translate = this.d3Zoom.translate(), translate0 = [], l = [],
        view = {
            x: translate[0],
            y: translate[1],
            k: this.d3Zoom.scale()
        }, bounded;

    translate0 = [
        (center[0] - view.x) / view.k,
        (center[1] - view.y) / view.k
    ];

    if (direction == "reset") {
        view.k = 1;
        this.scrolled = true;
    } else {
        view.k = this._getNextScale(direction);
    }

    l = [ translate0[0] * view.k + view.x, translate0[1] * view.k + view.y ];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    bounded = this._bound([ view.x, view.y ], view.k);

    this._animate(bounded.translate, bounded.scale);
};

Zoom.prototype._bound = function(translate, scale) {
    var width = this.$container.width(),
        height = this.$container.height();

    translate[0] = Math.min(
        (width / height)  * (scale - 1),
        Math.max( width * (1 - scale), translate[0] )
    );

    translate[1] = Math.min(0, Math.max(height * (1 - scale), translate[1]));

    return { translate: translate, scale: scale };
};

Zoom.prototype._update = function(translate, scale) {
    this.d3Zoom
        .translate(translate)
        .scale(scale);

    this.datamap.svg.selectAll("g")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

    this._displayPercentage(scale);
};

Zoom.prototype._animate = function(translate, scale) {
    var _this = this,
        d3Zoom = this.d3Zoom;

    d3.transition().duration(350).tween("zoom", function() {
        var iTranslate = d3.interpolate(d3Zoom.translate(), translate),
            iScale = d3.interpolate(d3Zoom.scale(), scale);

        return function(t) {
            _this._update(iTranslate(t), iScale(t));
        };
    });
};

Zoom.prototype._displayPercentage = function(scale) {
    var value;

    value = Math.round(Math.log(scale) / Math.log(this.scale.max) * 100);
    //console.log('zoom percent: ', `${value}%`);
    //this.$info.text(value + "%");
};

Zoom.prototype._getScalesArray = function() {
    var array = [],
        scaleMaxLog = Math.log(this.scale.max);

    for (var i = 0; i <= 10; i++) {
        array.push(Math.pow(Math.E, 0.1 * i * scaleMaxLog));
    }

    return array;
};

Zoom.prototype._getNextScale = function(direction) {
    var scaleSet = this.scale.set,
        currentScale = this.d3Zoom.scale(),
        lastShift = scaleSet.length - 1,
        shift, temp = [];

    if (this.scrolled) {

        for (shift = 0; shift <= lastShift; shift++) {
            temp.push(Math.abs(scaleSet[shift] - currentScale));
        }

        shift = temp.indexOf(Math.min.apply(null, temp));

        if (currentScale >= scaleSet[shift] && shift < lastShift) {
            shift++;
        }

        if (direction == "out" && shift > 0) {
            shift--;
        }

        this.scrolled = false;

    } else {

        shift = this.scale.currentShift;

        if (direction == "out") {
            shift > 0 && shift--;
        } else {
            shift < lastShift && shift++;
        }
    }

    this.scale.currentShift = shift;

    return scaleSet[shift];
};

function Datamap() {
    this.$container = $("#d3");
    this.hello = 'hello';
    this.instance = new Datamaps({
        scope: 'world',
        element: this.$container.get(0),
        projection: 'mercator',
        done: this._handleMapReady.bind(this),
        responsive: true
    });

    this.instance.path = d3.geo.path().projection(this.instance.projection);
    dm = this.instance;

    const inst = this.instance;
    window.addEventListener('resize', function() {
        inst.resize();
    });
}

Datamap.prototype._handleMapReady = function(datamap) {
    this.zoom = new Zoom({
        $container: this.$container,
        datamap: datamap
    });
}

function D3Ctrl() {
    const map = new Datamap();
    map.zoom.init();
}

statesModule.controller('D3Ctrl', D3Ctrl);
