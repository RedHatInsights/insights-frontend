'use strict';

var componentsModule = require('../');

function noActions() {
    return {
        scope: {
            text: '@'
        },
        templateUrl: 'js/components/noActions/noActions.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('noActions', noActions);
