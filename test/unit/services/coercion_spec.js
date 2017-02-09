/*global angular */
'use strict';

describe('Unit: CoercionService', function () {
    var service;

    beforeEach(function () {
        angular.mock.module('insights');
        angular.mock.inject(function (CoercionService) {
            service = CoercionService;
        });
    });

    it('should exist', function () {
        expect(service).toBeDefined();
    });

    it('should fall back to english', function () {
        service.coerce().should.equal('en');
        service.coerce('foo').should.equal('en');
        service.coerce('barrr').should.equal('en');
        service.coerce('123arrr').should.equal('en');
        service.coerce('').should.equal('en');
        service.coerce(undefined).should.equal('en');
        service.coerce(null).should.equal('en');
    });

    it('should select the proper lang', function () {
        service.coerce('EN-GB').should.equal('en');
        service.coerce('en').should.equal('en');

        service.coerce('zh_CN').should.equal('zh_cn');
        service.coerce('zh').should.equal('zh_cn');
        service.coerce('zhCN').should.equal('zh_cn');

        service.coerce('jaJP').should.equal('ja');
        service.coerce('JAJAJA').should.equal('ja');
    });
});