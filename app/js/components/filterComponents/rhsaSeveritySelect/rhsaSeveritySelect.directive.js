'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');
const filter = require('lodash/filter');

/**
 * @ngInject
 */
function rhsaSeveritySelectCtrl($rootScope,
                                $scope,
                                $location,
                                $timeout,
                                $document,
                                gettextCatalog,
                                Events,
                                RhsaSeverityFilters,
                                FilterService) {
    const optionsMap = {};

    $scope.options = angular.extend([], RhsaSeverityFilters);

    // Add selected to each option to be used as the checkbox
    // ng-model. makes options map in both directions
    // (index: string && string: index).
    $scope.options.forEach(function (option, index) {
        option.selected = false;
        optionsMap[index] = option.title;
        optionsMap[option.title] = index;
    });

    // default option is showing all rhsas
    // index for $scope.options
    const DEFAULT_OPTION = 0;

    /**
     * Returns the string representation for one or more selected options.
     *
     * @return {String} representation showing there are one or
     *                  more options selected
     */
    $scope.getSelectedString = function () {
        let options = filter($scope.options, {selected: true});

        return options.length === 1 ? options[0].title : 'multiple';
    };

    /**
     * Sets url query and broadcasts events to execute the query.
     */
    $scope.doFilter = setURL;

    function setURL() {
        let str = '';
        let tags = [];
        $scope.options.forEach(function (option, index) {
            if (option.selected && str === '' &&
                index !== DEFAULT_OPTION) {
                str = option.title;
                tags.push(option.tag);
            } else if (option.selected && index !== DEFAULT_OPTION) {
                str += `,${option.title}`;
                tags.push(option.tag);
            }
        });

        if (str === '') {
            $location.search(Events.filters.rhsaSeverity, null);
        } else {
            $location.search(Events.filters.rhsaSeverity, str);
        }

        FilterService.doFilter();
        $rootScope.$broadcast(Events.filters.rhsaSeverity, str);
        $rootScope.$broadcast(Events.filters.multipleTags, tags,
                      Events.filters.rhsaSeverity);

        return str;
    }

    /**
     * Watches for changes in the object that keeps track of selected
     * checkboxes.
     */
    $scope.$watch('options', setSelectedOptions, true);

    function setSelectedOptions(newVal, old) {
        if (newVal[DEFAULT_OPTION].selected && !old[DEFAULT_OPTION].selected) {
            setDefaultOption();
            return;
        }

        let isOptionSelected = false;
        $scope.options.forEach(function (option, index) {
            // if something other than all is selected than All is deselected
            if (!isOptionSelected && option.selected &&
                index !== DEFAULT_OPTION) {
                isOptionSelected = true;
                $scope.options[DEFAULT_OPTION].selected = false;
            }
        });

        if (!isOptionSelected) {
            $scope.options[DEFAULT_OPTION].selected = true;
        }
    }

    /**
     * sets selected option to the default
     */
    function setDefaultOption() {
        filter($scope.options, {selected: true}).forEach((option) => {
            option.selected = false;
        });

        $scope.options[DEFAULT_OPTION].selected = true;
    }

    /**
     * Initializes rhsa filter by checking for the url for
     * the previous filter or defaults to showing all rhsas/pacakges/cves.
     */
    (function init() {
        Object.freeze(optionsMap);
        let option = $location.search()[Events.filters.rhsaSeverity] ?
                     $location.search()[Events.filters.rhsaSeverity] :
                     DEFAULT_OPTION;

        if (option) {
            option = option.split(',');
            option.forEach(function (option) {
                $scope.options[optionsMap[option]].selected = true;
            });

            $scope.doFilter();
        } else {
            setDefaultOption();
        }
    })();

    // applies filter when the menu closes
    const menuCloseListener = $scope.$on('$mdMenuClose', $scope.doFilter);
    const resetFilterListener = $scope.$on(Events.filters.reset, setDefaultOption);
    const removeTagListener =
        $scope.$on(Events.filters.removeMultipleTags, function (event, filter, tag) {
            if (filter === Events.filters.rhsaSeverity) {
                if ($scope.options[DEFAULT_OPTION].tag === tag) {
                    setDefaultOption();
                } else {
                    find($scope.options, {tag: tag}).selected = false;
                    $scope.doFilter();
                }
            }
        });

    // removes all listeners when $scope is destroyed
    $scope.$on('$destroy', function () {
        removeTagListener();
        resetFilterListener();
        menuCloseListener();
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
