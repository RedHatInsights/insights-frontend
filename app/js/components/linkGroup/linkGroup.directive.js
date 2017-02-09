'use strict';

var componentsModule = require('../');
var find = require('lodash/collection/find');

/**
 * @ngInject
 */
function linkGroupCtrl($scope, $state, InventoryService, SystemsService) {

    $scope.collapsed = true;

    $scope.toggleCollapsed = function () {
        $scope.collapsed = !$scope.collapsed;
    };

    $scope.hasReports = function () {
        var hasReports = false;
        $scope.group.forEach(function (system) {
            if (system.report_count > 0 && !hasReports) {
                hasReports = true;
            }
        });

        return hasReports;
    };

    $scope.getLinkGroupText = function () {
        var type = find(SystemsService.getSystemTypes(), {id: parseInt($scope.typeid)});
        var text = '';
        if (type) {
            text = $scope.group.length + ' ' + type.displayName;
            if ($scope.group.length !== 1) {
                text += 's';
            }
        }

        return text;
    };

    $scope.getLinkReportCount = function (link) {
        var report_count = link.report_count;
        var response = '';
        if (report_count !== undefined && report_count !== null) {
            response = report_count + ' Action';

            if (report_count !== 1) {
                response = response + 's';
            }
        }

        return response;
    };

    $scope.getLinkStatus = function (link) {
        if (link.report_count > 0) {
            return '["fa-exclamation-circle", "fail"]';
        } else {
            return '["fa-check-circle", "success"]';
        }
    };

    $scope.getLinkName = function (link) {
        if (link.display_name !== undefined &&
            link.display_name !== null &&
            link.display_name !== '') {

            return link.display_name;
        } else {
            return link.hostname;
        }
    };

    $scope.goToSystem = function (system) {
        InventoryService.showSystemModal(system);
    };
}

function linkGroup() {
    return {
        templateUrl: 'js/components/linkGroup/linkGroup.html',
        restrict: 'E',
        controller: linkGroupCtrl,
        scope: {
            group: '=',
            typeid: '='
        }
    };
}

componentsModule.directive('linkGroup', linkGroup);
