'use strict';

var servicesModule = require('./');
var moment = require('moment');

/**
 * @ngInject
 */
function TimezoneService (User, $q) {
    var timezone = {
        loaded: false
    };
    timezone.promise = $q(function (resolve) {
        User.asyncCurrent(function (user) {
            if (angular.isDefined(user.timezone) && moment.tz.zone(user.timezone.name)) {
                timezone.name = user.timezone.name;
                timezone.long =
                    '(GMT ' +
                    moment().tz(user.timezone.name).format('Z') + ') ' +
                    user.timezone.name;
                timezone.loaded = true;
            } else {
                // fallback if for some reason we do not recognize the time zone
                timezone.name = 'UTC';
                timezone.long = 'UTC';
                timezone.loaded = true;
            }

            resolve(timezone);

            // $scope.$broadcast('timezone:change');
        });
    });

    return timezone;
}

servicesModule.service('TimezoneService', TimezoneService);
