'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function riskOfChangeSelectCtrl($location,
                            $rootScope,
                            $scope,
                            gettextCatalog,
                            Events) {
    $scope.options = {
        all: {
            label: gettextCatalog.getString('All'),
            tag: null
        },
        1: {
            label: gettextCatalog.getString('Very Low'),
            tag: gettextCatalog.getString('Risk of Change: Very Low')
        },
        2: {
            label: gettextCatalog.getString('Low'),
            tag: gettextCatalog.getString('Risk of Change: Low')
        },
        3: {
            label: gettextCatalog.getString('Moderate'),
            tag: gettextCatalog.getString('Risk of Change: Moderate')
        },
        4: {
            label: gettextCatalog.getString('High'),
            tag: gettextCatalog.getString('Risk of Change: High')
        }
    };

    $scope.select = function (option) {
        $scope.selected = $scope.options[option];
        $location.search('riskOfChange', option);

        // If 'All' is selected there is no reason to store the filter
        if (option === 'All') {
            delete $location.search().riskOfChange;
        }

        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.riskOfChangeSelect);
        $rootScope.$broadcast(Events.filters.riskOfChange, $scope.selected.value);
    };

    function getTag () {
        return $scope.selected.tag;
    }

    function read() {
        let riskOfChange = $location.search().riskOfChange || 'all';
        $scope.selected = $scope.options[riskOfChange];
        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.riskOfChangeSelect);
    }

    read();

    $scope.$on(Events.filters.reset, function () {
        $scope.select('all');
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.riskOfChangeSelect) {
            $scope.select('all');
        }
    });
}

function riskOfChangeSelect() {
    return {
        templateUrl:
            'js/components/filterComponents/riskOfChangeSelect/riskOfChangeSelect.html',
        restrict: 'E',
        controller: riskOfChangeSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('riskOfChangeSelect', riskOfChangeSelect);
