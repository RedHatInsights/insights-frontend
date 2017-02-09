'use strict';

var apiModule = require('./');
var indexBy = require('lodash/collection/indexBy');

/**
 * @ngInject
 */
function Ack($http, $q, $rootScope, AccountService, InsightsConfig) {
    var root = InsightsConfig.apiRoot;
    var _acks = [];
    var _ackMap = {};
    var loaded = false;

    function getData() {
        var promise = $http.get(
            root + 'acks' + '?include=rule' + AccountService.current('&'))
            .success(function (acks) {
                _acks.length = 0;
                Array.prototype.push.apply(_acks, acks);
                angular.extend(_ackMap, indexBy(_acks, 'rule_id'));
            });

        return promise;
    }

    $rootScope.$on('reload:data', getData);
    return {
        init: function () {
            if (!loaded) {
                getData();
                loaded = true;
            }
        },

        acks: _acks,
        ackMap: _ackMap,
        createAck: function (rule) {
            var dfd = $q.defer();
            $http.post(root + 'acks' + AccountService.current(), {
                rule_id: (rule.rule_id || rule.id)
            }).success(function (ack) {
                _acks.push(ack);
                _ackMap[ack.rule_id] = ack;
                dfd.resolve(ack);
            });

            return dfd.promise;
        },

        deleteAck: function (ack) {
            return $http.delete(root + 'acks/' + ack.id + AccountService.current())
                .success(function () {
                    var len = _acks.length;
                    for (let i = 0; i < len; i++) {
                        if (_acks[i].id === ack.id) {
                            _acks.splice(i, 1);
                            delete _ackMap[ack.rule_id];
                            return;
                        }
                    }
                });
        },

        reload: getData
    };
}

apiModule.factory('Ack', Ack);
