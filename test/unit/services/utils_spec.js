/*global angular */
'use strict';

describe('Utils', function () {
    var service;
    var scope;

    beforeEach(function () {
        angular.mock.module('insights');
        angular.mock.inject(function (Utils, $rootScope) {
            service = Utils;
            scope = $rootScope.$new();
        });
    });

    it('should exist', function () {
        expect(service).toBeDefined();
    });

    describe('alias', function () {
        it('creates a new property referencing the same value as the given property',
            function () {
                var foo = {name: 'FOO'};
                var alias = service.alias('name', 'nick');
                alias(foo);
                foo.nick.should.equal(foo.name);
            });
    });

    describe('watchOnce', function () {
        it('is called exactly once', function () {
            var observed = false;
            var i = 1;
            service.watchOnce(scope, 'test', function (value) {
                observed = value;
            });

            for (; i < 5; i++) {
                scope.test = i;
                scope.$apply();
            }

            observed.should.equal(1);
        });
    });

    describe('get', function () {
        it('retrieves a value', function () {
            service.get({
                foo: {
                    bar: 'baz'
                }
            }, 'foo.bar', 'default').should.equal('baz');
        });

        it('defaults on undefined', function () {
            service.get({
                foo: 'bar'
            }, 'baz', 'default').should.equal('default');
        });

        it('defaults on null', function () {
            service.get({
                foo: null
            }, 'foo', 'default').should.equal('default');
        });
    });
});
