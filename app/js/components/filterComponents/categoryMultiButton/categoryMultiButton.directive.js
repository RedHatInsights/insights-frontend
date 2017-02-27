'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function categoryMultiButtonCtrl(
    $scope,
    Categories,
    FilterService) {

    var key = $scope.key || 'categoryFilters';

    $scope.categoryButtons = [];
    Categories.forEach(function (category) {
        $scope.categoryButtons.push({
            label: category,
            stateKey: key + category,
            icon: ['category-icon', category.toLowerCase()],
            toggleCallback: function () {
                FilterService.doFilter();
                $scope.onClick();
            }
        });
    });
}

function categoryMultiButton() {
    return {
        templateUrl:
            'js/components/filterComponents/categoryMultiButton/categoryMultiButton.html',
        restrict: 'E',
        controller: categoryMultiButtonCtrl,
        scope: {
            key: '=?',
            onClick: '&'
        }
    };
}

componentsModule.directive('categoryMultiButton', categoryMultiButton);
