/*global angular */
'use strict';

describe('MaintenanceTable', function () {
    var scope,
        ctrl;

    beforeEach(function () {
        angular.mock.module('insights', function ($provide) {
            // mock Report and Maintenance API services
            $provide.factory("Report", function ($q) {
                return {
                    getAllReports: function () {
                        return $q.when([]);
                    }
                };
            });
            $provide.factory("Maintenance", function ($q) {
                return {
                    getMaintenancePlans: function () {
                        return $q.when([]);
                    }
                };
            });
            $provide.factory("User", function ($q) {
                return {
                    init: function () {
                        return $q.when({
                            account_number: '540155',
                            is_internal: true
                        });
                    },
                    current: {}
                };
            });
        });
        angular.mock.inject(function ($rootScope, $controller, $q) {
            scope = $rootScope.$new();

            scope.item = {
                actions: [
                    { id: 1, display: 'delta', type: 0 },
                    { id: 2, display: 'echo', type: 0 },
                    { id: 3, display: 'foxtrot', type: 0 },
                    { id: 4, display: 'golf', type: 0 },
                    { id: 5, display: 'alpha', type: 0 },
                    { id: 6, display: 'bravo', type: 0 },
                    { id: 7, display: 'charlie', type: 0 }
                ]
            };
            var params = {
                implicitOrder: {
                    predicate: 'display',
                    reverse: false
                },
                getActions: function () {
                    return scope.item.actions;
                },
                getAvailableActions: function () {
                    return $q.when([
                        { id: 8, display: 'hotel', type: 1 },
                        { id: 9, display: 'india', type: 1 }
                    ]);
                },
                saved: {}
            };
            params.save = function (toAdd, toRemove) {
                params.saved = {
                    toAdd: toAdd,
                    toRemove: toRemove
                };
                return $q.when();
            };
            scope.paramsCallback = function () {
                return params;
            };

            ctrl = $controller('MaintenanceTableCtrl', {
                $scope: scope
            });

            scope.$digest();
        });
    });

    it('works with the given input', function () {
        ctrl.data[0].id.should.equal(5);
        ctrl.data[0].display.should.equal('alpha');
        ctrl.data[1].id.should.equal(6);
        ctrl.data[1].display.should.equal('bravo');
    });

    it('sorts items by id', function () {
        ctrl.sorter.sort('id');
        ctrl.data[0].id.should.equal(1);
        ctrl.data[0].display.should.equal('delta');
        ctrl.data[1].id.should.equal(2);
        ctrl.data[1].display.should.equal('echo');
    });


    it('splits data into pages', function () {
        ctrl.pager.perPage = 4;
        ctrl.sorter.sort('id');
        ctrl.sorter.sort('id'); // descending
        
        // first page: 7, 6, 5, 4
        ctrl.pager.currentPage.should.equal(1);
        ctrl.data.length.should.equal(4);
        ctrl.data.forEach(function (item) {
            item.id.should.be.above(3);
        });

        ctrl.pager.currentPage = 2;
        ctrl.page();
        // second page: 3, 2, 1
        ctrl.data.length.should.equal(3);
        ctrl.data.forEach(function (item) {
            item.id.should.be.below(4);
        });
    });

    it('filters data based on search term', function () {
        ctrl.filter.display = 'ch';
        ctrl.doFilter();
        ctrl.data.length.should.equal(2);
        var names = ctrl.data.map(function (item) {
            return item.display;
        });
        names.should.containEql('charlie');
        names.should.containEql('echo');
    });

    it('shows available actions when in edit mode', function () {
        scope.edit = true;
        scope.$digest();
        ctrl.orderedActions.length.should.equal(9);

        ctrl.cancel();
        scope.$digest();
        ctrl.orderedActions.length.should.equal(7);
    });

    it('works with checkboxes', function () {
        var event = {
            target: {
                tagName: 'TD'
            },
            type: 'click'
        };

        // true by default
        scope.checkboxes.isChecked(1).should.be.true();

        scope.checkboxRowClick(event, 1);
        scope.$digest();
        scope.checkboxes.isChecked(1).should.be.true(); // still true since not in edit mode

        scope.edit = true;
        scope.$digest();

        scope.checkboxRowClick(event, 1);
        scope.$digest();
        scope.checkboxes.isChecked(1).should.be.false();
    });

    it('calls params.save() upon save', function () {
        scope.edit = true;
        scope.$digest();

        scope.checkboxes.items[5] = false;
        scope.$digest();
        scope.checkboxes.isChecked(5).should.be.false();

        ctrl.save();
        ctrl.params.saved.toAdd.length.should.equal(0);
        ctrl.params.saved.toRemove.length.should.equal(1);
        ctrl.params.saved.toRemove[0].id.should.equal(5);
    });
});
