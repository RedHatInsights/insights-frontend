/*global require*/
'use strict';

const componentsModule = require('../');

/**
 * @ngInject
 */
function pageHeaderCtrl($scope, gettextCatalog) {

    function init() {
        $scope.titleTranslated = gettextCatalog.getString($scope.title);
    }

    init();
}

function pageHeader() {
    return {
        transclude: true,
        templateUrl: 'js/components/pageHeader/pageHeader.html',
        restrict: 'E',
        replace: false,
        controller: pageHeaderCtrl,
        scope: {
            title: '@',
            icon: '@'
        }
    };
}

componentsModule.directive('pageHeader', pageHeader);
