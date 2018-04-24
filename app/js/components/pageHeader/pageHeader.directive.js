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
        replace: true,
        controller: pageHeaderCtrl,
        scope: {
            title: '@',
            icon: '@',
            subtitle: '=',
            link: '@'
        }
    };
}

componentsModule.directive('pageHeader', pageHeader);
