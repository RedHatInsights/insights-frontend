'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function rhsaSeveritySelectCtrl($rootScope,
                                $scope,
                                $location,
                                gettextCatalog,
                                Events,
                                RhsaSeverityFilters,
                                FilterService) {
    const optionsMap = {};
    $scope.options = [];
    angular.extend($scope.options, RhsaSeverityFilters);

    // Add selected to each option to be used as the checkbox
    // ng-model
    $scope.options.forEach(function (option, index) {
        option.selected = false;
        optionsMap[index] = option.title;
        optionsMap[option.title] = index;
    });

    // default option is showing all rhsas
    // index for $scope.options
    const DEFAULT_OPTION = 0;

    /**
     * Initializes rhsa filter by checking for the url for
     * the previous filter or defaults to showing all rhsas/pacakges/cves.
     */
    (function init() {
        Object.freeze(optionsMap);
        let option = $location.search()[Events.filters.rhsaSeverity] ?
                     $location.search()[Events.filters.rhsaSeverity] :
                     FilterService.getRhsaSeverity();

        if (option) {
            option = option.split(',');
            option.forEach(function (option) {
                $scope.options[optionsMap[option]].selected = true;
            });
        } else {
            setDefaultOption($scope.options);
        }

        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.rhsaSeverity);
    })();

    /**
     * Concatenates the tabs if multiple severities are chosen.
     *
     * @return {String} tag for filters
     */
    function getTag() {
        let tag = '';
        $scope.options.forEach(function (option) {
            if (option.selected && tag === '') {
                tag = option.tag;
            } else if (option.selected) {
                tag += `, ${option.title}`;
            }
        });

        return tag;
    }

    /**
     * Returns the string representation when there are multiple choices.
     *
     * @return {String} representation showing there are one or
     *                  more options selected
     */
    $scope.getSelectedString = function () {
        let str = '';
        $scope.options.forEach(function (option) {
            if (option.selected) {
                if (str.length > 0) {
                    return `${str}...`;
                }

                str = option.title;
            }
        });

        return str;
    };

    /**
     * Sets url param and broadcast all options
     */
    function setFilterParams(options) {
        let str = '';
        options.forEach(function (option, index) {
            if (option.selected && str === '' &&
                index !== DEFAULT_OPTION) {
                str = option.title;
            } else if (option.selected && index !== DEFAULT_OPTION) {
                str += `,${option.title}`;
            }
        });

        if (str === '') {
            FilterService.setRhsaSeverity(DEFAULT_OPTION);
            FilterService.deleteQueryParam(Events.filters.rhsaSeverity);
        } else {
            console.log(str);
            FilterService.setRhsaSeverity(str);
        }

        FilterService.doFilter();
        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.rhsaSeverity);
        $rootScope.$broadcast(Events.filters.rhsaSeverity, str);
    }

    /**
     * Watches for changes in the object that keeps track of selected
     * checkboxes.
     */
    $scope.$watch('options', function (newVal, old) {

        // deselect all other checkboxes if "All" is selected
        if (!old[DEFAULT_OPTION].selected && newVal[DEFAULT_OPTION].selected) {
            setDefaultOption(newVal);
        } else {
            let isOptionSelected = false;
            newVal.forEach(function (option, index) {
                // if something other than all is selected than All is deselected
                if (option.selected && index !== DEFAULT_OPTION) {
                    isOptionSelected = true;
                    newVal[DEFAULT_OPTION].selected = false;
                }
            });

            if (!isOptionSelected) {
                newVal[DEFAULT_OPTION].selected = true;
            }
        }

        setFilterParams(newVal);
    }, true);

    /**
     * sets selected option to the default
     */
    function setDefaultOption(options) {
        options.forEach(function (option, index) {
            if (index === DEFAULT_OPTION) {
                option.selected = true;
            } else {
                option.selected = false;
            }
        });

        setFilterParams(options);
    }

    $scope.$on(Events.filters.reset, function () {
        setDefaultOption($scope.options);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.rhsaSeverity) {
            setDefaultOption($scope.options);
        }
    });
}

function rhsaSeveritySelect() {
    return {
        templateUrl:
          'js/components/filterComponents/rhsaSeveritySelect/rhsaSeveritySelect.html',
        restrict: 'E',
        controller: rhsaSeveritySelectCtrl,
        scope: {}
    };
}

componentsModule.directive('rhsaSeveritySelect', rhsaSeveritySelect);
