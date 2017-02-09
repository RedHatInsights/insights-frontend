'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function severityMultiButtonCtrl(
    $scope,
    $location,
    Severities,
    FilterService,
    MultiButtonService) {

    $scope.severityButtons = [];
    let stateAlreadySet = false;
    Severities.forEach(function (severity) {
        $scope.severityButtons.push({
            label: severity,
            icon: severity + '-severity-icon',
            stateKey: 'severityFilters' + severity,
            toggleCallback: FilterService.doFilter
        });
        if (MultiButtonService.getState('severityFilters' + severity)) {
            MultiButtonService.setState('severityFilters' + severity, true);
            stateAlreadySet = true;
        }
    });

    if (!stateAlreadySet) {
        MultiButtonService.setState('severityFiltersAll', true);
    }
}

function severityMultiButton() {
    return {
        templateUrl:
            'js/components/filterComponents/' +
            'severityMultiButton/severityMultiButton.html',
        restrict: 'E',
        replace: true,
        controller: severityMultiButtonCtrl
    };
}

componentsModule.directive('severityMultiButton', severityMultiButton);
