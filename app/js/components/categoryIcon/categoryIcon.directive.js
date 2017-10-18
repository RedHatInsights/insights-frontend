'use strict';

var componentsModule = require('../');

function categoryIcon() {
    return {
        scope: {
            category: '='
        },
        templateUrl: 'js/components/categoryIcon/categoryIcon.html',
        restrict: 'E',
        replace: false
    };
}

componentsModule.directive('categoryIcon', categoryIcon);
