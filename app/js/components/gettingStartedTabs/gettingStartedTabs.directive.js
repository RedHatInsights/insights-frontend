'use strict';

var componentsModule = require('../');

function gettingStartedTabs() {
    return {
        templateUrl: 'js/components/gettingStartedTabs/gettingStartedTabs.html',
        restrict: 'ECA',
        replace: false
    };
}

componentsModule.directive('gettingStartedTabs', gettingStartedTabs);
