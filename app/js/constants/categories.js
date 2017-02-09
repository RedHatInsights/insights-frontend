'use strict';
var constantsModule = require('./');

constantsModule.constant('Categories',
    ['all', 'availability', 'stability', 'performance', 'security']);

/**
 * @ngInject
 */
function __Categories(gettext) {
    gettext('all');
    gettext('availability');
    gettext('stability');
    gettext('performance');
    gettext('security');
}

// This controller is not actually used, just needed to extract the category strings
constantsModule.controller('__Categories', __Categories);
