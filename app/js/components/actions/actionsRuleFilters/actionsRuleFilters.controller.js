'use strict';

var componentsModule = require('../../');

function actionsRuleFilters() {
    return {
        templateUrl: 'js/components/actions/actionsRuleFilters/actionsRuleFilters.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('actionsRuleFilters', actionsRuleFilters);
