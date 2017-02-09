'use strict';

const componentsModule = require('../');
const find = require('lodash/collection/find');

/**
 * @ngInject
 */
function simpleSelectCtrl($scope) {

    function handleDefault () {
        if ($scope.model === undefined && $scope.options && $scope.options.length) {
            $scope.selected = find($scope.options, {id: null});
        }
    }

    $scope.$watch('options', handleDefault);
    $scope.$watch('model', function (model) {
        $scope.selected = find($scope.options, function (option) {
            return String(option.id).toLowerCase() === String(model).toLowerCase();
        });

        handleDefault();
    });

    $scope.select = function (selected) {
        $scope.selected = selected;
        $scope.model = selected.id;
    };
}

function simpleSelect() {
    return {
        scope: {
            model: '=',
            options: '=',
            disabled: '='
        },
        templateUrl: 'js/components/simpleSelect/simpleSelect.html',
        restrict: 'E',
        replace: true,
        controller: simpleSelectCtrl
    };
}

componentsModule.directive('simpleSelect', simpleSelect);
