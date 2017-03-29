'use strict';
var apiModule = require('./');

/**
 * @ngInject
 */
function Group($http, $q, $rootScope, InsightsConfig, AccountService) {
    var root = InsightsConfig.apiRoot;
    var _groups = [];
    var _currentGroup = {};
    var loaded = false;

    function getData() {
        return $http.get(
            root + 'groups' + '?include=systems' +
            AccountService.current('&')).success(function (groups) {
                _groups.length = 0;
                Array.prototype.push.apply(_groups, groups);
            });
    }

    function _removeSystem(group, system) {
        var len = _groups.length;
        for (let i = 0; i < len; i++) {
            if (_groups[i].id === group.id) {
                let sysLen = _groups[i].systems.length;
                for (let j = 0; j < sysLen; j++) {
                    if (_groups[i].systems[j].system_id === system.system_id) {
                        _groups[i].systems.splice(j, 1);
                        return;
                    }
                }
            }
        }
    }

    function removeSystem(group, system) {
        _removeSystem(group, system);
        return $http.delete(
            root + 'groups/' + group.id + '/systems/' +
            system.system_id + AccountService.current());
    }

    function _removeGroup(group) {
        var len = _groups.length;
        for (let i = 0; i < len; i++) {
            if (_groups[i].id === group.id) {
                _groups.splice(i, 1);
                return;
            }
        }
    }

    $rootScope.$on('reload:data', getData);
    return {
        init: function () {
            if (!loaded) {
                getData();
                loaded = true;
            }
        },

        groups: _groups,
        current: function () {
            return _currentGroup;
        },

        appendCurrentGroup: function (url) {
            var group = _currentGroup;
            if (group && group.id) {
                url += ('&group=' + group.id);
            }

            return url;
        },

        setCurrent: function (group) {
            if (group) {
                _currentGroup = group;
            } else {
                _currentGroup = {};
            }
        },

        removeSystem: removeSystem,
        removeSystems: function (group, systems) {
            var dfdList = [];
            angular.forEach(systems, function (system) {
                dfdList.push(removeSystem(group, {
                    system_id: system
                }));
            });

            return $q.all(dfdList);
        },

        addSystems: function (group, systems) {
            if (!group.systems) {
                group.systems = [];
            }

            Array.prototype.push.apply(group.systems, systems);
            return $http.put(
                root +
                'groups/' +
                group.id +
                '/systems' +
                AccountService.current(), systems);
        },

        createGroup: function (newGroup) {
            var dfd = $q.defer();
            $http.post(root + 'groups' + AccountService.current(), newGroup)
                .then(function (res) {
                    newGroup.display_name = '';
                    let group = res.data;
                    if (res.status === 201) {
                        group.systems = [];
                        _groups.push(group);
                    }

                    dfd.resolve(group);
                });

            return dfd.promise;
        },

        deleteGroup: function (group) {
            _removeGroup(group);
            return $http.delete(root + 'groups/' + group.id + AccountService.current());
        },

        reload: getData,

        queryParam: function () {
            if (_currentGroup && _currentGroup.id) {
                return {
                    group: _currentGroup.id
                };
            }

            return {};
        }
    };
}

apiModule.factory('Group', Group);
