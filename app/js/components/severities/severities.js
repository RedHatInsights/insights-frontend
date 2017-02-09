'use strict';

var componentsModule = require('../');

componentsModule.constant('Severities', ['All', 'INFO', 'WARN', 'ERROR']);

/**
 * @ngInject
 */
function __Severities(gettext) {
    gettext('All');
    gettext('INFO');
    gettext('WARN');
    gettext('ERROR');
}

// This controller is not actually used, just needed to extract the severity strings
componentsModule.controller('__Severities', __Severities);
