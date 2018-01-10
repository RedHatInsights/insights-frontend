'use strict';

var componentsModule = require('../../');

/**
* @ngInject
*/

function navFooterCtrl() {  }

function navFooter() {
    return {
        templateUrl: 'js/components/nav/nav-footer/nav-footer.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: navFooterCtrl
    };
}

componentsModule.directive('navFooter', navFooter);
