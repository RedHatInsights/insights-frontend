'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */

function contentInfo() {
    return {
        templateUrl: 'js/components/content-info/content-info.html',
        restrict: 'EC',
        transclude: true,
        replace: true
    };
}

componentsModule.directive('contentInfo', contentInfo);
