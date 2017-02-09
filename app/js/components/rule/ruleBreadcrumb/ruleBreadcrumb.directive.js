'use strict';

var componentsModule = require('../../');

function ruleBreadcrumb() {
    return {
        templateUrl: 'js/components/rule/ruleBreadcrumb/ruleBreadcrumb.html',
        restrict: 'ECA'
    };
}

componentsModule.directive('ruleBreadcrumb', ruleBreadcrumb);
