'use strict';

var componentsModule = require('../');
var moment = require('moment-timezone');

// intentionally not using moment.isSame()
// as that does not seem to work properly with timezones
function isSameDate(one, two) {
    return one.year() === two.year() &&
        one.month() === two.month() &&
        one.date() === two.date();
}

/**
 * @ngInject
 */
function timeRangeCtrl($scope) {
    var format = 'LT';
    var dateFormat = 'MMM D';

    function init() {
        $scope.startTime = moment($scope.start).tz($scope.timezone);
        $scope.endTime = moment($scope.end).tz($scope.timezone);

        let referenceDate =
            moment($scope.start).tz(
                ($scope.referenceTimezone ?
                    $scope.referenceTimezone :
                    $scope.timezone));

        // start/end dates are only shown if they differ from the reference date
        $scope.startDate = false;
        $scope.endDate = false;

        if (!isSameDate(referenceDate, $scope.startTime)) {
            $scope.startDate = $scope.startTime.format(dateFormat);
        }

        if (!isSameDate(referenceDate, $scope.endTime)) {
            $scope.endDate = $scope.endTime.format(dateFormat);
        }

        $scope.startTime = $scope.startTime.format(format);
        $scope.endTime = $scope.endTime.format(format);
    }

    init();

    $scope.$watchGroup(['start', 'end', 'timezone', 'referenceTimezone'], init);
}

function timeRange() {
    return {
        templateUrl: 'js/components/timeRange/timeRange.html',
        restrict: 'E',
        controller: timeRangeCtrl,
        replace: true,
        scope: {
            start: '=start',
            end: '=end',
            timezone: '=timezone',
            referenceTimezone: '=?referenceTimezone'
        }
    };
}

componentsModule.directive('timeRange', timeRange);
