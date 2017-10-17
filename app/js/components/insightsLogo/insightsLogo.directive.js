'use strict';

var componentsModule = require('../');

function insightsLogo() {
    return {
        templateUrl: 'js/components/insightsLogo/insightsLogo.html',
        restrict: 'EC',
        replace: false
    };
}

componentsModule.directive('insightsLogo', insightsLogo);
