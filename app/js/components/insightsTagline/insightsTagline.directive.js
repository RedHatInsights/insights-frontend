'use strict';

var componentsModule = require('../');

function insightsTagline() {
    return {
        templateUrl: 'js/components/insightsTagline/insightsTagline.html',
        restrict: 'EC',
        replace: false
    };
}

componentsModule.directive('insightsTagline', insightsTagline);
