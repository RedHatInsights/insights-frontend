/*global require*/
'use strict';

const componentsModule = require('../../../');

function incidentLite() {
    return {
        templateUrl: 'js/components/overview/widgets/incidentLite/incidentLite.html',
        restrict: 'E',
        replace: true,
        scope: {
            incidentCount: '<',
            incidentSystemCount: '<'
        }
    };
}

componentsModule.directive('incidentLite', incidentLite);
