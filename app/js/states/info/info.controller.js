'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function InfoCtrl(PermalinkService) {
    PermalinkService.scroll();
}

statesModule.controller('InfoCtrl', InfoCtrl);
