'use strict';

const bulk = require('bulk-require');

function TestModule() {
    this.module = angular.module('insights.components', []);
}

TestModule.prototype.directive = function (name, factory) {
    const obj = factory();
    this.module.controller(obj.controller.name, obj.controller);
};

if (process && process.env && process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
    module.exports = angular.module('insights.components', []);

    bulk(__dirname, ['./**/!(*.unit).js']);
} else {
    module.exports = new TestModule();
}
