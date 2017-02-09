'use strict';

var componentsModule = require('../');

function gettingStartedTabs() {
    return {
        templateUrl: 'js/components/gettingStartedTabs/gettingStartedTabs.html',
        restrict: 'ECA',
        replace: true
    };
}

componentsModule.directive('gettingStartedTabs', gettingStartedTabs);
