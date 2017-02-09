'use strict';

var componentsModule = require('../');

function insightsTagline() {
    return {
        templateUrl: 'js/components/insightsTagline/insightsTagline.html',
        restrict: 'EC',
        replace: true
    };
}

componentsModule.directive('insightsTagline', insightsTagline);
