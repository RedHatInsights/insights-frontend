'use strict';

var componentsModule = require('../');

function insightsLogo() {
    return {
        templateUrl: 'js/components/insightsLogo/insightsLogo.html',
        restrict: 'EC',
        replace: true
    };
}

componentsModule.directive('insightsLogo', insightsLogo);
