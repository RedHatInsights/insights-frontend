'use strict';

var componentsModule = require('../../');

function actionsRuleFilters() {
    return {
        templateUrl: 'js/components/actions/actionsRuleFilters/actionsRuleFilters.html',
        restrict: 'E',
        replace: false
    };
}

componentsModule.directive('actionsRuleFilters', actionsRuleFilters);
