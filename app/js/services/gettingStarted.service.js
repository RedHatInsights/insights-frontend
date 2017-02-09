'use strict';

var servicesModule = require('./');

function GettingStarted() {
    var _sections = [];

    function set(sections) {
        _sections.length = 0;
        Array.prototype.push.apply(_sections, sections);
        return _sections;
    }

    function add(crumb) {
        _sections.push(crumb);
    }

    return {
        sections: function () {
            return _sections;
        },

        setSections: set,
        addSection: add
    };
}

servicesModule.factory('GettingStarted', GettingStarted);
