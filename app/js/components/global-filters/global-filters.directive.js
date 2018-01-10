'use strict';

const componentsModule = require('../');

/**
 * @ngInject
 */
function globalFiltersCtrl() { }

function globalFilters() {
    return {
        templateUrl: 'js/components/global-filters/global-filters.html',
        restrict: 'E',
        controller: globalFiltersCtrl,
        replace: true
    };
}

componentsModule.directive('globalFilters', globalFilters);
