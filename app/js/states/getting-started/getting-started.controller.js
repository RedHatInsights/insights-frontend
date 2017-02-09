'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function GettingStartedCtrl($scope, GettingStarted, sections) {
    GettingStarted.setSections(sections);
}

statesModule.controller('GettingStartedCtrl', GettingStartedCtrl);
