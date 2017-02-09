'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleStateMultiButtonCtrl($scope, RuleStates, MultiButtonService) {
    const key = 'rule-admin-state';
    const localStorageKey = 'insights:' + key;

    function callback (val) {
        $scope.onChange({state: val});
    }

    $scope.ruleStateButtons = RuleStates.map(function (label) {
        const state = label.replace(' ', '-');
        return {
            label: label,
            stateKey: key + state,
            icon: state + '-rule-state-icon',
            toggleCallback: function () {
                window.localStorage.setItem(localStorageKey, state);
                callback(state);
            }
        };
    });

    // init MultiButtonService and load previous selection from localStorage
    $scope.ruleStateButtons.forEach(function (button) {
        MultiButtonService.initState(button.stateKey);
    });

    const activeKey = window.localStorage.getItem(localStorageKey) || 'all';
    MultiButtonService.setState(key + activeKey, true);
    callback(activeKey);
}

function ruleStateMultiButton() {
    return {
        templateUrl: 'js/components/filterComponents/ruleStateMultiButton/' +
            'ruleStateMultiButton.html',
        restrict: 'E',
        controller: ruleStateMultiButtonCtrl,
        scope: {
            onChange: '&'
        }
    };
}

componentsModule.directive('ruleStateMultiButton', ruleStateMultiButton);
