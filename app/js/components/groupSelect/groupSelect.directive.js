'use strict';

var componentsModule = require('../');
var isEmpty = require('lodash/lang/isEmpty');
const includes = require('lodash/collection/includes');

// group-select is disabled in these states
const DISABLED_STATES = [
    'app.config',
    'app.digests',
    'app.overview',
    'app.rules'
];

/**
 * @ngInject
 */
function groupSelectCtrl($scope, $rootScope, Group, Events, $state) {
    Group.init();
    $scope.groups = Group.groups;
    $scope.group = Group.current();

    function checkState () {
        $scope.disabled = includes(DISABLED_STATES, $state.current.name);
    }

    $scope.$on('$stateChangeSuccess', checkState);
    checkState();

    $scope.triggerChange = function (group) {
        $scope.group = group;
        Group.setCurrent(group);
        $rootScope.$broadcast('group:change', group);
    };

    $scope.$on('account:change', function () {
        $scope.triggerChange(null);
    });

    $scope.isGroupSelected = function () {
        return !isEmpty($scope.group);
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.group = Group.current();
    });
}

function groupSelect() {
    return {
        templateUrl: 'js/components/groupSelect/groupSelect.html',
        restrict: 'E',
        replace: true,
        controller: groupSelectCtrl,
        scope: {
            round: '='
        }
    };
}

componentsModule.directive('groupSelect', groupSelect);
