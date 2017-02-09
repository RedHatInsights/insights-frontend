/*global angular, require, window*/
'use strict';

var apiModule = require('./');
var indexBy = require('lodash/collection/indexBy');
var priv = {};

priv.tryFakeUser = function (_user) {
    var entitlements;

    // just for test, does not affect what comes back from the API
    // i.e. nothing "leaks" here
    try {
        entitlements =
            JSON.parse(window.localStorage.getItem('insights:fake:entitlements'));
        if (entitlements !== undefined && entitlements !== null) {
            _user.current_entitlements = entitlements;
        }
    } catch (ignore) {}

    // } catch (e) { console.log(e); }
};

/**
 * @ngInject
 */
function User($rootScope, $http, $q, $location, InsightsConfig, PreferenceService) {
    var _user = {
        loaded: false
    };
    var _userDfd;

    function isBeta() {
        // Temporary work around to only allow OSP in beta.
        // Remove the following code when OSP is ready for production.
        return $location.absUrl().indexOf('insightsbeta') > -1;
    }

    //function setPreferences() {
    //PreferenceService.set(
    //    'hide_ignored_rules', _user.settings.hide_ignored_rules, false);
    //if (_user.settings.dashboard_mode && isBeta()) {
    //PreferenceService.set(
    //    'dashboard_mode', _user.settings.dashboard_mode, false);
    //if (_user.settings.dashboard_mode === 'osp') {
    //PreferenceService.set(
    //    'osp_deployment', _user.settings.osp_deployment, false);
    //}
    //}
    //}

    function init() {
        $http.get(InsightsConfig.apiRoot + 'me').success(function (user) {
            angular.extend(_user, user);
            _user.permissions = indexBy(_user.permissions, 'code');

            // used to keep up with is_internal in cases where is_internal is modified by
            // an internal user
            _user.is_super = _user.is_internal;

            //setPreferences();

            if (_user.current_entitlements && _user.current_entitlements.unlimitedRHEL) {
                _user.current_entitlements.systemLimitReached = false;
            }

            if (window.localStorage.getItem('insights:user:isInternal') !== null &&
                    _user.is_super === true) {
                _user.is_internal = window.localStorage.getItem(
                    'insights:user:isInternal') === 'true';
            }

            _user.loaded = true;
            PreferenceService.set('loaded', true, false);
            priv.tryFakeUser(_user);

            $rootScope.$broadcast('user:loaded');
            if (window.localStorage.getItem('tapi:demo') === 'true') {
                _user.is_internal = false;
                _user.demo_mode = true;
            }

            _userDfd.resolve(_user);
        });
    }

    return {
        init: function () {
            if (!angular.isDefined(_userDfd)) {
                _userDfd = $q.defer();
                init();
            }

            return _userDfd.promise;
        },

        current: _user,
        asyncCurrent: function (cb) {
            if (_user && _user.loaded) {
                return cb(_user);
            } else if (_userDfd && _userDfd.promise) {
                _userDfd.promise.then(cb);
            }
        },

        isOnOSPWhitelist: function () {
            var onOSPWhitelist  = false;

            if (!isBeta()) {
                return false;
            }

            if (_user && _user.current_entitlements) {
                onOSPWhitelist = _user.current_entitlements.whitelist.osp;
            }

            return onOSPWhitelist;
        }
    };
}

apiModule.factory('User', User);
