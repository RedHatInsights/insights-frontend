/*global describe, it, require*/
'use strict';

// contains all mocked constants/controllers/etc.
const mocked = require('../../../../../unit');
const sinon = require('sinon');
const events = mocked.constants.Events;
const likelihoodFilters = mocked.constants.LikelihoodFilters;

require('./likelihoodSelect.directive');

describe('likelihoodSelectCtrl', () => {
    let $scope;
    let $rootScope;
    let $location;
    let locationSearchSpy;
    let rootScopeBroadCastSpy;

    beforeEach(angular.mock.module('insights.components'));

    beforeEach(angular.mock.module(($provide) => {
        $provide.constant('Events', events);
        $provide.constant('LikelihoodFilters', likelihoodFilters);
    }));

    beforeEach(inject((_$rootScope_,
                        _$controller_,
                        _$location_,
                        Events,
                        LikelihoodFilters) => {

        let likelihood = 0;
        $rootScope = _$rootScope_;
        $location = _$location_;
        $scope = $rootScope.$new();
        rootScopeBroadCastSpy = sinon.spy($rootScope, '$broadcast');
        locationSearchSpy = sinon.spy($location, 'search');

        _$controller_('likelihoodSelectCtrl', {
            $scope: $scope,
            $location: $location,
            $rootScope: $rootScope,
            LikelihoodFilters: LikelihoodFilters,
            Events: Events,

            // filter.service.js is being removed no need to mock
            FilterService: {
                getLikelihood: function () {
                    return likelihood;
                },

                setLikelihood: function (l) {
                    likelihood = l;
                },

                doFilter: function () {}
            }
        });
    }));

    afterEach(() => {
        rootScopeBroadCastSpy.restore();
        locationSearchSpy.restore();
        console.log('adsf');
    });

    it('should create controller with initial state', () => {
        $scope.options.should.equal(likelihoodFilters);

        // The all option should be the default
        $scope.selected.should.equal(likelihoodFilters[0]);

        locationSearchSpy.should.be.calledOnce();
        locationSearchSpy.args[0].length.should.equal(0);
        rootScopeBroadCastSpy.should.be.calledOnce();
        rootScopeBroadCastSpy.should.be.calledWithExactly(events.filters.tag,
            likelihoodFilters[0].tag,
            events.filters.likelihood);
    });

    describe('$scope.select()', () => {
        it('should change the selected filter options', () => {
            likelihoodFilters.forEach((filter, index) => {
                // resets the spy's call count/state
                rootScopeBroadCastSpy.restore();
                locationSearchSpy.restore();
                rootScopeBroadCastSpy = sinon.spy($rootScope, '$broadcast');
                locationSearchSpy = sinon.spy($location, 'search');

                $scope.select(index);
                $rootScope.$broadcast.should.be.calledTwice();
                $rootScope.$broadcast.should.be.calledWithExactly(events.filters.tag,
                    filter.tag,
                    events.filters.likelihood);
                $rootScope.$broadcast
                    .should.be.calledWithExactly(events.filters.likelihood);

                locationSearchSpy.should.be.calledOnce();

                if (index === 0) {
                    locationSearchSpy.should.be
                        .calledWithExactly(events.filters.likelihood, null);
                } else {
                    locationSearchSpy.should.be
                        .calledWithExactly(events.filters.likelihood, index);
                }
            });
        });
    });
});
