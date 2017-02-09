'use strict';

var componentsModule = require('../');

function categoryIcon() {
    return {
        scope: {
            category: '='
        },
        templateUrl: 'js/components/categoryIcon/categoryIcon.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('categoryIcon', categoryIcon);
